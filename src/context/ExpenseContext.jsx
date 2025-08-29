import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { dbService } from '../db/database';

// Initial state
const initialState = {
  expenses: [],
  categories: [],
  loading: false,
  error: null
};

// Action types
export const EXPENSE_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  LOAD_DATA: 'LOAD_DATA',
  ADD_EXPENSE: 'ADD_EXPENSE',
  UPDATE_EXPENSE: 'UPDATE_EXPENSE',
  DELETE_EXPENSE: 'DELETE_EXPENSE',
  ADD_CATEGORY: 'ADD_CATEGORY',
  DELETE_CATEGORY: 'DELETE_CATEGORY'
};

// Reducer function
function expenseReducer(state, action) {
  switch (action.type) {
    case EXPENSE_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case EXPENSE_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case EXPENSE_ACTIONS.LOAD_DATA:
      return {
        ...state,
        expenses: action.payload.expenses || [],
        categories: action.payload.categories || state.categories,
        loading: false,
        error: null
      };

    case EXPENSE_ACTIONS.ADD_EXPENSE:
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
        error: null
      };

    case EXPENSE_ACTIONS.UPDATE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.map(expense =>
          expense.id === action.payload.id ? action.payload : expense
        ),
        error: null
      };

    case EXPENSE_ACTIONS.DELETE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload),
        error: null
      };

    case EXPENSE_ACTIONS.ADD_CATEGORY:
      return {
        ...state,
        categories: [...state.categories, action.payload],
        error: null
      };

    case EXPENSE_ACTIONS.DELETE_CATEGORY:
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload),
        expenses: state.expenses.filter(expense => expense.categoryId !== action.payload),
        error: null
      };

    default:
      return state;
  }
}

// Create context
const ExpenseContext = createContext();

// Custom hook to use the expense context
export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};

// Provider component
export const ExpenseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  // Load data from database on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        dispatch({ type: EXPENSE_ACTIONS.SET_LOADING, payload: true });
        
        // Load categories first (includes initialization of defaults)
        const categories = await dbService.initializeDefaultCategories();
        console.log('Categories loaded in context:', categories);
        
        // Load expenses
        const expenses = await dbService.getAllExpenses();
        
        dispatch({
          type: EXPENSE_ACTIONS.LOAD_DATA,
          payload: { expenses, categories }
        });
      } catch (error) {
        console.error('Error loading data from database:', error);
        dispatch({
          type: EXPENSE_ACTIONS.SET_ERROR,
          payload: 'Failed to load data from database'
        });
      }
    };

    loadData();
  }, []);

  // Action creators
  const addExpense = async (expenseData) => {
    try {
      const newExpense = await dbService.addExpense(expenseData);
      dispatch({ type: EXPENSE_ACTIONS.ADD_EXPENSE, payload: newExpense });
      return newExpense;
    } catch (error) {
      dispatch({
        type: EXPENSE_ACTIONS.SET_ERROR,
        payload: 'Failed to add expense'
      });
      throw error;
    }
  };

  const updateExpense = async (id, expenseData) => {
    try {
      const updatedExpense = await dbService.updateExpense(id, expenseData);
      dispatch({ type: EXPENSE_ACTIONS.UPDATE_EXPENSE, payload: updatedExpense });
      return updatedExpense;
    } catch (error) {
      dispatch({
        type: EXPENSE_ACTIONS.SET_ERROR,
        payload: 'Failed to update expense'
      });
      throw error;
    }
  };

  const deleteExpense = async (id) => {
    try {
      await dbService.deleteExpense(id);
      dispatch({ type: EXPENSE_ACTIONS.DELETE_EXPENSE, payload: id });
    } catch (error) {
      dispatch({
        type: EXPENSE_ACTIONS.SET_ERROR,
        payload: 'Failed to delete expense'
      });
      throw error;
    }
  };

  const addCategory = async (categoryData) => {
    try {
      const newCategory = await dbService.addCategory(categoryData);
      dispatch({ type: EXPENSE_ACTIONS.ADD_CATEGORY, payload: newCategory });
      return newCategory;
    } catch (error) {
      dispatch({
        type: EXPENSE_ACTIONS.SET_ERROR,
        payload: 'Failed to add category'
      });
      throw error;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await dbService.deleteCategory(id);
      dispatch({ type: EXPENSE_ACTIONS.DELETE_CATEGORY, payload: id });
      // Reload expenses to reflect category changes
      const expenses = await dbService.getAllExpenses();
      dispatch({ type: EXPENSE_ACTIONS.LOAD_DATA, payload: { expenses, categories: state.categories } });
    } catch (error) {
      dispatch({
        type: EXPENSE_ACTIONS.SET_ERROR,
        payload: 'Failed to delete category'
      });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: EXPENSE_ACTIONS.SET_ERROR, payload: null });
  };

  // Calculate totals and statistics
  const getTotalExpenses = () => {
    return state.expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
  };

  const getExpensesByCategory = () => {
    const categoryTotals = {};
    state.expenses.forEach(expense => {
      const categoryId = expense.categoryId;
      if (!categoryTotals[categoryId]) {
        categoryTotals[categoryId] = 0;
      }
      categoryTotals[categoryId] += parseFloat(expense.amount);
    });
    return categoryTotals;
  };

  const getRecentExpenses = (limit = 5) => {
    return [...state.expenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  };

  // Additional database-specific functions
  const exportData = async () => {
    try {
      return await dbService.exportData();
    } catch (error) {
      dispatch({
        type: EXPENSE_ACTIONS.SET_ERROR,
        payload: 'Failed to export data'
      });
      throw error;
    }
  };

  const importData = async (data) => {
    try {
      dispatch({ type: EXPENSE_ACTIONS.SET_LOADING, payload: true });
      await dbService.importData(data);
      
      // Reload data after import
      const categories = await dbService.getAllCategories();
      const expenses = await dbService.getAllExpenses();
      
      dispatch({
        type: EXPENSE_ACTIONS.LOAD_DATA,
        payload: { expenses, categories }
      });
      
      return true;
    } catch (error) {
      dispatch({
        type: EXPENSE_ACTIONS.SET_ERROR,
        payload: 'Failed to import data'
      });
      throw error;
    }
  };

  const clearAllData = async () => {
    try {
      dispatch({ type: EXPENSE_ACTIONS.SET_LOADING, payload: true });
      await dbService.clearAllData();
      
      // Reinitialize default categories
      const categories = await dbService.initializeDefaultCategories();
      
      dispatch({
        type: EXPENSE_ACTIONS.LOAD_DATA,
        payload: { expenses: [], categories }
      });
      
      return true;
    } catch (error) {
      dispatch({
        type: EXPENSE_ACTIONS.SET_ERROR,
        payload: 'Failed to clear data'
      });
      throw error;
    }
  };

  const value = {
    ...state,
    addExpense,
    updateExpense,
    deleteExpense,
    addCategory,
    deleteCategory,
    clearError,
    getTotalExpenses,
    getExpensesByCategory,
    getRecentExpenses,
    exportData,
    importData,
    clearAllData
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};
