import React, { useState, useEffect } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import './ExpenseForm.css';

const ExpenseForm = ({ expenseToEdit, onCancel, onSuccess }) => {
  const { categories, addExpense, updateExpense } = useExpenses();
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debug: Log categories when they change
  useEffect(() => {
    console.log('Categories in ExpenseForm:', categories);
    console.log('Categories length:', categories?.length);
  }, [categories]);

  // Populate form when editing
  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        amount: expenseToEdit.amount.toString(),
        description: expenseToEdit.description,
        categoryId: expenseToEdit.categoryId,
        date: expenseToEdit.date
      });
    }
  }, [expenseToEdit]);

  const validateForm = () => {
    const newErrors = {};

    // Amount validation
    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 3) {
      newErrors.description = 'Description must be at least 3 characters';
    }

    // Category validation
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    // Date validation
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const expenseData = {
        amount: parseFloat(formData.amount),
        description: formData.description.trim(),
        categoryId: formData.categoryId,
        date: formData.date
      };

      if (expenseToEdit) {
        await updateExpense(expenseToEdit.id, expenseData);
      } else {
        await addExpense(expenseData);
      }

      // Reset form
      setFormData({
        amount: '',
        description: '',
        categoryId: '',
        date: new Date().toISOString().split('T')[0]
      });
      setErrors({});

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving expense:', error);
      setErrors({ submit: 'Failed to save expense. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      amount: '',
      description: '',
      categoryId: '',
      date: new Date().toISOString().split('T')[0]
    });
    setErrors({});
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="expense-form-container">
      <form onSubmit={handleSubmit} className="expense-form">
        <h3 className="form-title">
          {expenseToEdit ? 'Edit Expense' : 'Add New Expense'}
        </h3>

        {errors.submit && (
          <div className="error-message">
            {errors.submit}
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount" className="form-label">
              Amount ($)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className={`form-input ${errors.amount ? 'error' : ''}`}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            {errors.amount && (
              <div className="form-error">{errors.amount}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="date" className="form-label">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className={`form-input ${errors.date ? 'error' : ''}`}
            />
            {errors.date && (
              <div className="form-error">{errors.date}</div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="categoryId" className="form-label">
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            className={`form-select ${errors.categoryId ? 'error' : ''}`}
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <div className="form-error">{errors.categoryId}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={`form-input ${errors.description ? 'error' : ''}`}
            placeholder="Enter expense description"
            maxLength="100"
          />
          {errors.description && (
            <div className="form-error">{errors.description}</div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading"></span>
                {expenseToEdit ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              expenseToEdit ? 'Update Expense' : 'Add Expense'
            )}
          </button>

          {(expenseToEdit || onCancel) && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
