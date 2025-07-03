import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import MemeGallery from './components/MemeGallery';
import TextBoxEditor from './components/TextBoxEditor';
import MemeCanvas from './components/MemeCanvas';
import AdminPage from './components/AdminPage';

function App() {
  const [memeImages, setMemeImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [textBoxes, setTextBoxes] = useState([]);
  const [selectedTextBoxId, setSelectedTextBoxId] = useState(null);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Fetch meme templates from the backend API
  const fetchMemeTemplates = async () => {
    try {
      // Try to fetch from API first
      const response = await fetch('http://localhost:5000/api/templates');
      
      if (response.ok) {
        const templates = await response.json();
        const templatePaths = templates.map(template => template.path);
        setMemeImages(templatePaths);
        setApiError('');
      } else {
        throw new Error('Failed to fetch templates from API');
      }
    } catch (err) {
      console.error('Error fetching templates:', err);
      setApiError('Could not connect to backend server. Using local templates.');
      
      // Fallback to hardcoded list if API fails
      const fallbackImages = [
        'memes/CHEETAH_BUTTON-2.webp',
        'memes/Frank_Waiting-2.webp',
        'memes/GFUNK__COURTNEY.webp',
        'memes/Hilary_Smoking.webp',
        'memes/Skull_distracted.webp',
        'memes/WHAT_IF_I_TOLD_YOU.webp',
        'memes/beanzie_this_is_fine.webp',
        'memes/bring_it_marvin.webp',
        'memes/drake_wiggles.webp',
        'memes/gfunkbuttons.png',
        'memes/ivanova_squint_template.webp',
        'memes/other_women.webp'
      ];
      setMemeImages(fallbackImages);
    }
  };
  
  useEffect(() => {
    fetchMemeTemplates();
  }, []);

  // Handle image selection
  const handleSelectImage = (imagePath) => {
    setSelectedImage(imagePath);
  };

  // Handle adding a new text box
  const handleAddTextBox = () => {
    if (textBoxes.length >= 10) return; // Maximum 10 text boxes
    
    const newTextBox = {
      id: Date.now().toString(),
      text: 'Add text here',
      x: 50,
      y: 50 + textBoxes.length * 30, // Position each new text box slightly below the previous one
      fontSize: 36,
      fontFamily: 'Impact',
      color: '#ffffff',
      stroke: 'black',
      width: 200,
      height: 50,
      rotation: 0
    };
    
    const updatedTextBoxes = [...textBoxes, newTextBox];
    setTextBoxes(updatedTextBoxes);
    setSelectedTextBoxId(newTextBox.id);
  };

  // Handle selecting a text box
  const handleSelectTextBox = (id) => {
    setSelectedTextBoxId(id);
  };

  // Handle updating a text box
  const handleUpdateTextBox = (id, updates) => {
    const updatedTextBoxes = textBoxes.map(box => {
      if (box.id === id) {
        return { ...box, ...updates };
      }
      return box;
    });
    setTextBoxes(updatedTextBoxes);
  };

  // Handle removing a text box
  const handleRemoveTextBox = (id) => {
    const updatedTextBoxes = textBoxes.filter(box => box.id !== id);
    setTextBoxes(updatedTextBoxes);
    setSelectedTextBoxId(null);
  };

  // Navigate to admin page
  const goToAdmin = () => {
    navigate('/admin');
  };
  
  // Navigate back to editor
  const goToEditor = () => {
    navigate('/');
  };

  return (
    <div className="meme-generator">
      <Routes>
        <Route path="/admin" element={
          <AdminPage 
            onClose={goToEditor} 
            onTemplatesUpdated={fetchMemeTemplates} 
          />
        } />
        <Route path="/" element={
          <>
            <header className="meme-header">
              <h1>PV Meme Generator</h1>
              <div className="header-content">
                <p>Create custom memes with your favorite templates</p>
              </div>
              {apiError && <p className="api-error">{apiError}</p>}
            </header>
        
            {/* Template Gallery at the top */}
            <div className="meme-gallery-container">
              <h3>Choose a Template</h3>
              <MemeGallery 
                memeImages={memeImages} 
                selectedImage={selectedImage} 
                onSelectImage={handleSelectImage} 
              />
            </div>
            
            {/* Main editing area with canvas on left and controls on right */}
            <div className="meme-editor-container">
              <div className="meme-editor-left">
                <MemeCanvas 
                  selectedImage={selectedImage}
                  textBoxes={textBoxes}
                  selectedTextBoxId={selectedTextBoxId}
                  onSelectTextBox={handleSelectTextBox}
                  onUpdateTextBox={handleUpdateTextBox}
                />
              </div>
              
              <div className="meme-editor-right">
                <TextBoxEditor 
                  textBoxes={textBoxes}
                  selectedTextBoxId={selectedTextBoxId}
                  onUpdateTextBox={handleUpdateTextBox}
                  onSelectTextBox={handleSelectTextBox}
                  onAddTextBox={handleAddTextBox}
                  onRemoveTextBox={handleRemoveTextBox}
                />
              </div>
            </div>
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;
