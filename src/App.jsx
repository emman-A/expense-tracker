import React, { useState } from 'react';
import { ExpenseProvider } from './context/ExpenseContext';
import ExpenseForm from './components/ExpenseForm/ExpenseForm';
import ExpenseList from './components/ExpenseList/ExpenseList';
import DataManager from './components/DataManager/DataManager';
import './App.css';

function App() {
  const [editingExpense, setEditingExpense] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [showDataManager, setShowDataManager] = useState(false);

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
    // Scroll to top to show the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSuccess = () => {
    setEditingExpense(null);
    // Keep form visible for adding more expenses
  };

  const handleFormCancel = () => {
    setEditingExpense(null);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (editingExpense) {
      setEditingExpense(null);
    }
  };

  return (
    <ExpenseProvider>
      <div className="app">
        <header className="app-header">
          <div className="container">
            <div className="header-content">
              <div className="header-text">
                <h1>💰 Expense Tracker</h1>
                <p>Take control of your finances by tracking every expense</p>
              </div>
              <div className="header-buttons">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowDataManager(true)}
                  title="Manage your data - export, import, or clear"
                >
                  ⚙️ Data
                </button>
                <button
                  className={`btn ${showForm ? 'btn-secondary' : 'btn-primary'}`}
                  onClick={toggleForm}
                >
                  {showForm ? 'Hide Form' : 'Add Expense'}
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="app-main">
          <div className="container">
            {showForm && (
              <section className="form-section">
                <ExpenseForm
                  expenseToEdit={editingExpense}
                  onCancel={editingExpense ? handleFormCancel : null}
                  onSuccess={handleFormSuccess}
                />
              </section>
            )}

            <section className="list-section">
              <ExpenseList onEditExpense={handleEditExpense} />
            </section>
          </div>
        </main>

        <footer className="app-footer">
          <div className="container">
            <p>&copy; 2024 Expense Tracker. Built with React & Vite. Now with Database!</p>
          </div>
        </footer>

        {/* Data Manager Modal */}
        {showDataManager && (
          <DataManager onClose={() => setShowDataManager(false)} />
        )}
      </div>
    </ExpenseProvider>
  );
}

export default App;
