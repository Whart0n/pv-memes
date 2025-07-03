import React from 'react';

function TextBoxEditor({ textBoxes, selectedTextBoxId, onUpdateTextBox, onSelectTextBox, onAddTextBox, onRemoveTextBox }) {
  // Find the currently selected text box
  const selectedTextBox = textBoxes.find(box => box.id === selectedTextBoxId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onUpdateTextBox(selectedTextBoxId, { [name]: name === 'fontSize' ? parseInt(value, 10) : value });
  };

  return (
    <div className="text-box-editor">
      <h3>Text Controls</h3>
      
      {/* Button to add a new text box */}
      <button 
        className="btn btn-primary" 
        onClick={onAddTextBox}
        style={{ marginBottom: '20px', width: '100%' }}
      >
        Add New Text Box
      </button>
      
      {selectedTextBox ? (
        <>
          <div className="form-group">
            <label htmlFor="text">Text Content:</label>
            <textarea
              id="text"
              name="text"
              value={selectedTextBox.text}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="fontSize">Font Size:</label>
            <input
              type="range"
              id="fontSize"
              name="fontSize"
              min="12"
              max="72"
              value={selectedTextBox.fontSize}
              onChange={handleChange}
            />
            <span>{selectedTextBox.fontSize}px</span>
          </div>
          
          <div className="form-group">
            <label htmlFor="fontFamily">Font:</label>
            <select
              id="fontFamily"
              name="fontFamily"
              value={selectedTextBox.fontFamily}
              onChange={handleChange}
            >
              <option value="Impact">Impact</option>
              <option value="Arial">Arial</option>
              <option value="Comic Sans MS">Comic Sans MS</option>
              <option value="Times New Roman">Times New Roman</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="color">Text Color:</label>
            <div className="color-palette">
              {['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'].map(color => (
                <div 
                  key={color} 
                  className={`color-swatch ${selectedTextBox.color === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => onUpdateTextBox(selectedTextBoxId, { color })}
                />
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="stroke">
              Outline Color:
              <div className="remove-outline-container">
                <input
                  type="checkbox"
                  id="removeStroke"
                  checked={selectedTextBox.stroke === 'transparent'}
                  onChange={(e) => onUpdateTextBox(selectedTextBoxId, { stroke: e.target.checked ? 'transparent' : '#000000' })}
                  className="remove-outline-checkbox"
                />
                <label htmlFor="removeStroke" className="remove-outline-label">
                  Remove outline
                </label>
              </div>
            </label>
            
            {selectedTextBox.stroke !== 'transparent' && (
              <div className="color-palette">
                {['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'].map(color => (
                  <div 
                    key={color} 
                    className={`color-swatch ${selectedTextBox.stroke === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => onUpdateTextBox(selectedTextBoxId, { stroke: color })}
                  />
                ))}
              </div>
            )}
          </div>
          
          <button 
            className="btn btn-danger" 
            onClick={() => onRemoveTextBox(selectedTextBox.id)}
          >
            Remove Text Box
          </button>
        </>
      ) : (
        <div className="no-text-selected">
          <p>Add a text box or select an existing one to edit</p>
        </div>
      )}
      
      {/* List of all text boxes for quick selection */}
      {textBoxes.length > 0 && (
        <div className="text-box-list">
          <h4>Text Boxes</h4>
          {textBoxes.map(box => (
            <div 
              key={box.id} 
              className={`text-box-item ${selectedTextBoxId === box.id ? 'selected' : ''}`}
              onClick={() => onSelectTextBox(box.id)}
            >
              {box.text.substring(0, 20)}{box.text.length > 20 ? '...' : ''}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TextBoxEditor;
