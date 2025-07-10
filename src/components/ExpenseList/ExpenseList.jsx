import React, { useState, useMemo } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import ExpenseItem from '../ExpenseItem/ExpenseItem';
import './ExpenseList.css';

const ExpenseList = ({ onEditExpense }) => {
  const { expenses, categories, loading } = useExpenses();
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterCategory, setFilterCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Memoized filtered and sorted expenses
  const filteredAndSortedExpenses = useMemo(() => {
    let filtered = expenses;

    // Filter by category
    if (filterCategory) {
      filtered = filtered.filter(expense => expense.categoryId === filterCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(expense =>
        expense.description.toLowerCase().includes(term) ||
        expense.amount.toString().includes(term)
      );
    }

    // Sort expenses
    const sorted = [...filtered].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'amount':
          aValue = parseFloat(a.amount);
          bValue = parseFloat(b.amount);
          break;
        case 'description':
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        case 'category':
          const aCat = categories.find(cat => cat.id === a.categoryId);
          const bCat = categories.find(cat => cat.id === b.categoryId);
          aValue = aCat ? aCat.name.toLowerCase() : '';
          bValue = bCat ? bCat.name.toLowerCase() : '';
          break;
        case 'date':
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [expenses, categories, sortBy, sortOrder, filterCategory, searchTerm]);

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const getTotalAmount = () => {
    return filteredAndSortedExpenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return (
      <div className="expense-list-container">
        <div className="loading-state">
          <div className="loading"></div>
          <p>Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="expense-list-container">
      <div className="expense-list-header">
        <h2>Your Expenses</h2>
        
        {expenses.length > 0 && (
          <div className="expense-summary">
            <div className="summary-item">
              <span className="summary-label">Total Expenses:</span>
              <span className="summary-value">${getTotalAmount().toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Showing:</span>
              <span className="summary-count">
                {filteredAndSortedExpenses.length} of {expenses.length} expenses
              </span>
            </div>
          </div>
        )}
      </div>

      {expenses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💰</div>
          <h3>No expenses yet</h3>
          <p>Start tracking your expenses by adding your first expense above.</p>
        </div>
      ) : (
        <>
          <div className="expense-controls">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-container">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="filter-select"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredAndSortedExpenses.length === 0 ? (
            <div className="no-results">
              <p>No expenses match your current filters.</p>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('');
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="expense-table-header">
                <button
                  className={`sort-button ${sortBy === 'date' ? 'active' : ''}`}
                  onClick={() => handleSortChange('date')}
                >
                  Date {getSortIcon('date')}
                </button>
                <button
                  className={`sort-button ${sortBy === 'description' ? 'active' : ''}`}
                  onClick={() => handleSortChange('description')}
                >
                  Description {getSortIcon('description')}
                </button>
                <button
                  className={`sort-button ${sortBy === 'category' ? 'active' : ''}`}
                  onClick={() => handleSortChange('category')}
                >
                  Category {getSortIcon('category')}
                </button>
                <button
                  className={`sort-button ${sortBy === 'amount' ? 'active' : ''}`}
                  onClick={() => handleSortChange('amount')}
                >
                  Amount {getSortIcon('amount')}
                </button>
                <div className="actions-header">Actions</div>
              </div>

              <div className="expense-list">
                {filteredAndSortedExpenses.map(expense => (
                  <ExpenseItem
                    key={expense.id}
                    expense={expense}
                    onEdit={onEditExpense}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ExpenseList;
