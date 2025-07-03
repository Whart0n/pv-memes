import React, { useState, useEffect } from 'react';
import TemplateUploader from './TemplateUploader';
import AdminLogin from './AdminLogin';

const AdminPage = ({ onClose, onTemplatesUpdated }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Check for existing auth token when component mounts
  useEffect(() => {
    const token = localStorage.getItem('memeAdminToken');
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
      fetchTemplates(token);
    }
  }, []);

  const fetchTemplates = async (token = authToken) => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/templates`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }
      
      const data = await response.json();
      setTemplates(data);
      setError('');
    } catch (err) {
      setError('Error loading templates: ' + err.message);
      console.error('Error fetching templates:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteTemplate = async (filename) => {
    if (!window.confirm(`Are you sure you want to delete ${filename}?`)) {
      return;
    }
    
    setDeleteInProgress(true);
    setDeleteError('');
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/delete/${filename}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete template');
      }
      
      // Remove the deleted template from the list
      setTemplates(prevTemplates => 
        prevTemplates.filter(template => template.filename !== filename)
      );
      
      // Notify parent component that templates have been updated
      if (onTemplatesUpdated) {
        onTemplatesUpdated();
      }
    } catch (err) {
      setDeleteError(`Error deleting template: ${err.message}`);
      console.error('Error deleting template:', err);
    } finally {
      setDeleteInProgress(false);
    }
  };
  
  const handleLoginSuccess = (token) => {
    setAuthToken(token);
    setIsAuthenticated(true);
    fetchTemplates(token);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('memeAdminToken');
    setAuthToken('');
    setIsAuthenticated(false);
  };

  const handleTemplateUploaded = (newTemplate) => {
    // Add the new template to the list
    setTemplates(prevTemplates => [...prevTemplates, newTemplate]);
    
    // Notify parent component that templates have been updated
    if (onTemplatesUpdated) {
      onTemplatesUpdated();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-page">
        <div className="admin-header">
          <h2>Admin Panel</h2>
          <button className="btn btn-secondary" onClick={onClose}>
            Back to Meme Generator
          </button>
        </div>
        
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Admin Panel</h2>
        <div className="admin-actions">
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Back to Meme Generator
          </button>
        </div>
      </div>
      
      <div className="admin-content">
        <TemplateUploader 
          onTemplateUploaded={handleTemplateUploaded} 
          authToken={authToken}
        />
        
        <div className="template-list">
          <h3>Current Templates</h3>
          
          {deleteError && <p className="error-message">{deleteError}</p>}
          
          {loading ? (
            <p>Loading templates...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="template-grid">
              {templates.map((template, index) => (
                <div key={index} className="template-item">
                  <p className="template-name">{template.filename}</p>
                  <img 
                    src={template.path.startsWith('http') ? template.path : `/${template.path}`} 
                    alt={template.filename}
                    className="template-thumbnail"
                  />
                  <button 
                    className="btn btn-danger btn-sm delete-btn"
                    onClick={() => handleDeleteTemplate(template.filename)}
                    disabled={deleteInProgress}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
