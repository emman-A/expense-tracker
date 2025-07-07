import React, { useState } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import './ExpenseItem.css';

const ExpenseItem = ({ expense, onEdit }) => {
  const { categories, deleteExpense } = useExpenses();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Find the category for this expense
  const category = categories.find(cat => cat.id === expense.categoryId);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format amount for display
  const formatAmount = (amount) => {
    return parseFloat(amount).toFixed(2);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(expense);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteExpense(expense.id);
    } catch (error) {
      console.error('Error deleting expense:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="expense-item">
      <div className="expense-item-content">
        <div className="expense-date">
          <span className="date-label">Date</span>
          <span className="date-value">{formatDate(expense.date)}</span>
        </div>

        <div className="expense-description">
          <span className="description-label">Description</span>
          <span className="description-value" title={expense.description}>
            {expense.description}
          </span>
        </div>

        <div className="expense-category">
          <span className="category-label">Category</span>
          <div className="category-value">
            <span 
              className="category-indicator"
              style={{ backgroundColor: category?.color || '#64748b' }}
            ></span>
            <span className="category-name">
              {category?.name || 'Unknown'}
            </span>
          </div>
        </div>

        <div className="expense-amount">
          <span className="amount-label">Amount</span>
          <span className="amount-value">${formatAmount(expense.amount)}</span>
        </div>

        <div className="expense-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleEdit}
            disabled={isDeleting}
            title="Edit expense"
          >
            ✏️ Edit
          </button>
          
          <button
            className="btn btn-danger btn-sm"
            onClick={handleDeleteClick}
            disabled={isDeleting}
            title="Delete expense"
          >
            {isDeleting ? (
              <>
                <span className="loading"></span>
                Deleting...
              </>
            ) : (
              <>🗑️ Delete</>
            )}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-modal">
            <h4>Confirm Delete</h4>
            <p>
              Are you sure you want to delete this expense?
            </p>
            <div className="expense-preview">
              <strong>{expense.description}</strong>
              <span>${formatAmount(expense.amount)}</span>
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleDeleteCancel}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="loading"></span>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseItem;
