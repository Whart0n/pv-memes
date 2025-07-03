import React, { useState } from 'react';

const TemplateUploader = ({ onTemplateUploaded, authToken }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check if file is an image
      if (!selectedFile.type.match('image.*')) {
        setError('Please select an image file');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('memeTemplate', file);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload template');
      }

      setSuccess('Template uploaded successfully!');
      setFile(null);
      
      // Reset file input
      document.getElementById('template-file-input').value = '';
      
      // Notify parent component about the new template
      if (onTemplateUploaded) {
        onTemplateUploaded(data.file);
      }
    } catch (err) {
      setError(err.message || 'Failed to upload template');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="template-uploader">
      <h3>Upload New Template</h3>
      
      <div className="upload-form">
        <div className="form-group">
          <label htmlFor="template-file-input">Select Image:</label>
          <input
            type="file"
            id="template-file-input"
            accept="image/*"
            onChange={handleFileChange}
            className="form-control"
          />
        </div>
        
        {file && (
          <div className="file-preview">
            <p>Selected file: {file.name}</p>
            <img 
              src={URL.createObjectURL(file)} 
              alt="Preview" 
              style={{ maxWidth: '100%', maxHeight: '200px' }} 
            />
          </div>
        )}
        
        <button 
          className="btn btn-primary" 
          onClick={handleUpload}
          disabled={!file || uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Template'}
        </button>
        
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </div>
    </div>
  );
};

export default TemplateUploader;
