import React from 'react';

function MemeGallery({ memeImages, selectedImage, onSelectImage }) {
  return (
    <div className="meme-gallery">
      {memeImages.map((imagePath, index) => (
        <div 
          key={index} 
          className={`meme-thumbnail ${selectedImage === imagePath ? 'selected' : ''}`}
          onClick={() => onSelectImage(imagePath)}
        >
          <img 
            src={imagePath} 
            alt={`Meme template ${index + 1}`} 
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}

export default MemeGallery;
