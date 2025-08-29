import React, { useState } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import './DataManager.css';

const DataManager = ({ onClose }) => {
  const { exportData, importData, clearAllData } = useExpenses();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [message, setMessage] = useState('');

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setMessage('');
      
      const data = await exportData();
      
      // Create and download JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `expense-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setMessage('Data exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      setMessage('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsImporting(true);
      setMessage('');
      
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Validate data structure
      if (!data.expenses || !data.categories) {
        throw new Error('Invalid backup file format');
      }
      
      await importData(data);
      setMessage('Data imported successfully!');
      
      // Reset file input
      event.target.value = '';
    } catch (error) {
      console.error('Import failed:', error);
      setMessage('Import failed. Please check your file and try again.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleClearData = async () => {
    try {
      setIsClearing(true);
      setMessage('');
      
      await clearAllData();
      setMessage('All data cleared successfully!');
      setShowClearConfirm(false);
    } catch (error) {
      console.error('Clear data failed:', error);
      setMessage('Failed to clear data. Please try again.');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="data-manager-overlay">
      <div className="data-manager-modal">
        <div className="data-manager-header">
          <h3>Data Management</h3>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="data-manager-content">
          {message && (
            <div className={`message ${message.includes('failed') || message.includes('Failed') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          <div className="data-action">
            <div className="action-info">
              <h4>Export Data</h4>
              <p>Download all your expenses and categories as a backup file.</p>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <span className="loading"></span>
                  Exporting...
                </>
              ) : (
                '📥 Export Data'
              )}
            </button>
          </div>

          <div className="data-action">
            <div className="action-info">
              <h4>Import Data</h4>
              <p>Restore your data from a backup file. This will replace all current data.</p>
            </div>
            <div className="import-container">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={isImporting}
                className="file-input"
                id="import-file"
              />
              <label htmlFor="import-file" className={`btn btn-secondary ${isImporting ? 'disabled' : ''}`}>
                {isImporting ? (
                  <>
                    <span className="loading"></span>
                    Importing...
                  </>
                ) : (
                  '📤 Import Data'
                )}
              </label>
            </div>
          </div>

          <div className="data-action danger">
            <div className="action-info">
              <h4>Clear All Data</h4>
              <p>Permanently delete all expenses and reset categories to defaults.</p>
            </div>
            <button
              className="btn btn-danger"
              onClick={() => setShowClearConfirm(true)}
              disabled={isClearing}
            >
              🗑️ Clear All Data
            </button>
          </div>
        </div>

        {/* Clear Confirmation Modal */}
        {showClearConfirm && (
          <div className="confirm-overlay">
            <div className="confirm-modal">
              <h4>⚠️ Confirm Clear All Data</h4>
              <p>
                This action will permanently delete all your expenses and reset categories to defaults.
                <strong> This cannot be undone!</strong>
              </p>
              <p>Make sure you have exported your data as a backup before proceeding.</p>
              <div className="confirm-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowClearConfirm(false)}
                  disabled={isClearing}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleClearData}
                  disabled={isClearing}
                >
                  {isClearing ? (
                    <>
                      <span className="loading"></span>
                      Clearing...
                    </>
                  ) : (
                    'Yes, Clear All Data'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataManager;
