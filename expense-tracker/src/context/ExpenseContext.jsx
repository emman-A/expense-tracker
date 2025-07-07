import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  expenses: [],
  categories: [
    { id: 'food', name: 'Food & Dining', color: '#ef4444' },
    { id: 'transportation', name: 'Transportation', color: '#3b82f6' },
    { id: 'shopping', name: 'Shopping', color: '#8b5cf6' },
    { id: 'entertainment', name: 'Entertainment', color: '#f59e0b' },
    { id: 'bills', name: 'Bills & Utilities', color: '#10b981' },
    { id: 'healthcare', name: 'Healthcare', color: '#ec4899' },
    { id: 'education', name: 'Education', color: '#06b6d4' },
    { id: 'other', name: 'Other', color: '#64748b' }
  ],
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

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      dispatch({ type: EXPENSE_ACTIONS.SET_LOADING, payload: true });
      
      const savedExpenses = localStorage.getItem('expenses');
      const savedCategories = localStorage.getItem('categories');
      
      const expenses = savedExpenses ? JSON.parse(savedExpenses) : [];
      const categories = savedCategories ? JSON.parse(savedCategories) : initialState.categories;
      
      dispatch({
        type: EXPENSE_ACTIONS.LOAD_DATA,
        payload: { expenses, categories }
      });
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      dispatch({
        type: EXPENSE_ACTIONS.SET_ERROR,
        payload: 'Failed to load saved data'
      });
    }
  }, []);

  // Save to localStorage whenever expenses or categories change
  useEffect(() => {
    try {
      localStorage.setItem('expenses', JSON.stringify(state.expenses));
      localStorage.setItem('categories', JSON.stringify(state.categories));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
      dispatch({
        type: EXPENSE_ACTIONS.SET_ERROR,
        payload: 'Failed to save data'
      });
    }
  }, [state.expenses, state.categories]);

  // Action creators
  const addExpense = (expenseData) => {
    try {
      const newExpense = {
        id: Date.now().toString(),
        ...expenseData,
        createdAt: new Date().toISOString()
      };
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

  const updateExpense = (id, expenseData) => {
    try {
      const updatedExpense = {
        ...expenseData,
        id,
        updatedAt: new Date().toISOString()
      };
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

  const deleteExpense = (id) => {
    try {
      dispatch({ type: EXPENSE_ACTIONS.DELETE_EXPENSE, payload: id });
    } catch (error) {
      dispatch({
        type: EXPENSE_ACTIONS.SET_ERROR,
        payload: 'Failed to delete expense'
      });
      throw error;
    }
  };

  const addCategory = (categoryData) => {
    try {
      const newCategory = {
        id: Date.now().toString(),
        ...categoryData
      };
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

  const deleteCategory = (id) => {
    try {
      dispatch({ type: EXPENSE_ACTIONS.DELETE_CATEGORY, payload: id });
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
    getRecentExpenses
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};
