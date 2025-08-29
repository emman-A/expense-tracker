import Dexie from 'dexie';

// Define the database schema
export class ExpenseDatabase extends Dexie {
  constructor() {
    super('ExpenseTrackerDB');
    
    // Define schemas
    this.version(1).stores({
      expenses: '++id, amount, description, categoryId, date, createdAt, updatedAt',
      categories: 'id, name, color, isDefault',
      settings: '++id, key, value'
    });

    // Add hooks for automatic timestamps
    this.expenses.hook('creating', function (primKey, obj, trans) {
      obj.createdAt = new Date().toISOString();
      obj.updatedAt = new Date().toISOString();
    });

    this.expenses.hook('updating', function (modifications, primKey, obj, trans) {
      modifications.updatedAt = new Date().toISOString();
    });
  }
}

// Create database instance
export const db = new ExpenseDatabase();

// Database service functions
export const dbService = {
  // Expense operations
  async addExpense(expenseData) {
    try {
      const id = await db.expenses.add({
        ...expenseData,
        amount: parseFloat(expenseData.amount)
      });
      return await db.expenses.get(id);
    } catch (error) {
      console.error('Error adding expense to database:', error);
      throw error;
    }
  },

  async updateExpense(id, expenseData) {
    try {
      await db.expenses.update(id, {
        ...expenseData,
        amount: parseFloat(expenseData.amount)
      });
      return await db.expenses.get(id);
    } catch (error) {
      console.error('Error updating expense in database:', error);
      throw error;
    }
  },

  async deleteExpense(id) {
    try {
      await db.expenses.delete(id);
      return true;
    } catch (error) {
      console.error('Error deleting expense from database:', error);
      throw error;
    }
  },

  async getAllExpenses() {
    try {
      return await db.expenses.orderBy('date').reverse().toArray();
    } catch (error) {
      console.error('Error fetching expenses from database:', error);
      throw error;
    }
  },

  async getExpensesByDateRange(startDate, endDate) {
    try {
      return await db.expenses
        .where('date')
        .between(startDate, endDate, true, true)
        .toArray();
    } catch (error) {
      console.error('Error fetching expenses by date range:', error);
      throw error;
    }
  },

  async getExpensesByCategory(categoryId) {
    try {
      return await db.expenses
        .where('categoryId')
        .equals(categoryId)
        .toArray();
    } catch (error) {
      console.error('Error fetching expenses by category:', error);
      throw error;
    }
  },

  // Category operations
  async addCategory(categoryData) {
    try {
      await db.categories.put(categoryData);
      return await db.categories.get(categoryData.id);
    } catch (error) {
      console.error('Error adding category to database:', error);
      throw error;
    }
  },

  async updateCategory(id, categoryData) {
    try {
      await db.categories.update(id, categoryData);
      return await db.categories.get(id);
    } catch (error) {
      console.error('Error updating category in database:', error);
      throw error;
    }
  },

  async deleteCategory(id) {
    try {
      // First, update all expenses with this category to 'other'
      await db.expenses.where('categoryId').equals(id).modify({ categoryId: 'other' });
      // Then delete the category
      await db.categories.delete(id);
      return true;
    } catch (error) {
      console.error('Error deleting category from database:', error);
      throw error;
    }
  },

  async getAllCategories() {
    try {
      return await db.categories.toArray();
    } catch (error) {
      console.error('Error fetching categories from database:', error);
      throw error;
    }
  },

  // Settings operations
  async getSetting(key) {
    try {
      const setting = await db.settings.where('key').equals(key).first();
      return setting ? setting.value : null;
    } catch (error) {
      console.error('Error fetching setting from database:', error);
      throw error;
    }
  },

  async setSetting(key, value) {
    try {
      const existing = await db.settings.where('key').equals(key).first();
      if (existing) {
        await db.settings.update(existing.id, { value });
      } else {
        await db.settings.add({ key, value });
      }
      return true;
    } catch (error) {
      console.error('Error setting value in database:', error);
      throw error;
    }
  },

  // Utility operations
  async clearAllData() {
    try {
      await db.expenses.clear();
      await db.categories.clear();
      await db.settings.clear();
      return true;
    } catch (error) {
      console.error('Error clearing database:', error);
      throw error;
    }
  },

  async exportData() {
    try {
      const expenses = await db.expenses.toArray();
      const categories = await db.categories.toArray();
      const settings = await db.settings.toArray();
      
      return {
        expenses,
        categories,
        settings,
        exportDate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  },

  async importData(data) {
    try {
      // Clear existing data
      await this.clearAllData();
      
      // Import new data
      if (data.categories && data.categories.length > 0) {
        await db.categories.bulkPut(data.categories);
      }
      
      if (data.expenses && data.expenses.length > 0) {
        await db.expenses.bulkAdd(data.expenses);
      }
      
      if (data.settings && data.settings.length > 0) {
        await db.settings.bulkAdd(data.settings);
      }
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  },

  // Initialize default categories
  async initializeDefaultCategories() {
    try {
      const existingCategories = await db.categories.count();
      
      if (existingCategories === 0) {
        const defaultCategories = [
          { id: 'food', name: 'Food & Dining', color: '#ef4444', isDefault: true },
          { id: 'transportation', name: 'Transportation', color: '#3b82f6', isDefault: true },
          { id: 'shopping', name: 'Shopping', color: '#8b5cf6', isDefault: true },
          { id: 'entertainment', name: 'Entertainment', color: '#f59e0b', isDefault: true },
          { id: 'bills', name: 'Bills & Utilities', color: '#10b981', isDefault: true },
          { id: 'healthcare', name: 'Healthcare', color: '#ec4899', isDefault: true },
          { id: 'education', name: 'Education', color: '#06b6d4', isDefault: true },
          { id: 'other', name: 'Other', color: '#64748b', isDefault: true }
        ];
        
        await db.categories.bulkPut(defaultCategories);
        console.log('Default categories initialized');
      }
      
      return await db.categories.toArray();
    } catch (error) {
      console.error('Error initializing default categories:', error);
      throw error;
    }
  }
};

// Initialize database when module loads
db.open().then(async () => {
  console.log('Database ready');
  
  // Clear existing data if schema changed (for development)
  try {
    const existingCategories = await db.categories.toArray();
    console.log('Existing categories:', existingCategories);
    
    // If categories exist but have wrong structure, clear them
    if (existingCategories.length > 0 && typeof existingCategories[0].id === 'number') {
      console.log('Clearing old category data due to schema change');
      await db.categories.clear();
    }
  } catch (error) {
    console.log('Error checking existing categories, clearing data:', error);
    await db.categories.clear();
  }
  
  const categories = await dbService.initializeDefaultCategories();
  console.log('Categories after initialization:', categories);
}).catch(error => {
  console.error('Database initialization failed:', error);
});

export default db;
