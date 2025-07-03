import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Image, Text, Transformer } from 'react-konva';
import { saveAs } from 'file-saver';

function MemeCanvas({ selectedImage, textBoxes, selectedTextBoxId, onSelectTextBox, onUpdateTextBox }) {
  const stageRef = useRef(null);
  const imageRef = useRef(null);
  const textRefs = useRef({});
  const transformerRef = useRef(null);
  const [imageObj, setImageObj] = React.useState(null);
  const [dimensions, setDimensions] = React.useState({ width: 500, height: 500 });

  // Load the selected image
  useEffect(() => {
    if (!selectedImage) return;

    const img = new window.Image();
    img.src = selectedImage;
    img.onload = () => {
      // Calculate dimensions while maintaining aspect ratio
      const maxWidth = 500;
      const maxHeight = 500;
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        const ratio = maxWidth / width;
        width = maxWidth;
        height = height * ratio;
      }
      
      if (height > maxHeight) {
        const ratio = maxHeight / height;
        height = maxHeight;
        width = width * ratio;
      }
      
      setDimensions({ width, height });
      setImageObj(img);
    };
  }, [selectedImage]);

  // Update transformer when selected text box changes
  useEffect(() => {
    if (!transformerRef.current || !selectedTextBoxId) return;
    
    const selectedNode = textRefs.current[selectedTextBoxId];
    if (selectedNode) {
      transformerRef.current.nodes([selectedNode]);
      transformerRef.current.getLayer().batchDraw();
    } else {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedTextBoxId, textBoxes]);

  // Handle text box selection
  const handleTextBoxSelect = (id) => {
    onSelectTextBox(id);
  };

  // Handle text box transformation
  const handleTextBoxTransform = (id, newAttrs) => {
    onUpdateTextBox(id, newAttrs);
  };

  // Handle exporting the meme as an image
  const handleExport = () => {
    if (!stageRef.current) return;
    
    // Hide transformer during export
    const transformer = transformerRef.current;
    if (transformer) {
      transformer.visible(false);
      transformer.getLayer().batchDraw();
    }
    
    const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
    
    // Show transformer again
    if (transformer) {
      transformer.visible(true);
      transformer.getLayer().batchDraw();
    }
    
    // Generate filename based on current date/time
    const filename = `meme-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
    
    // Download the image
    saveAs(dataURL, filename);
  };

  return (
    <div className="meme-canvas-container">
      {selectedImage ? (
        <>
          <Stage 
            width={dimensions.width} 
            height={dimensions.height} 
            ref={stageRef}
          >
            <Layer>
              {imageObj && (
                <Image
                  image={imageObj}
                  width={dimensions.width}
                  height={dimensions.height}
                  ref={imageRef}
                />
              )}
              
              {textBoxes.map((box) => (
                <Text
                  key={box.id}
                  id={box.id}
                  text={box.text}
                  x={box.x}
                  y={box.y}
                  fontSize={box.fontSize}
                  fontFamily={box.fontFamily}
                  fill={box.color}
                  stroke={box.stroke}
                  strokeWidth={1}
                  width={box.width}
                  height={box.height}
                  draggable
                  onClick={() => handleTextBoxSelect(box.id)}
                  onTap={() => handleTextBoxSelect(box.id)}
                  onDragEnd={(e) => {
                    handleTextBoxTransform(box.id, {
                      x: e.target.x(),
                      y: e.target.y(),
                    });
                  }}
                  onTransform={(e) => {
                    const node = e.target;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();
                    
                    handleTextBoxTransform(box.id, {
                      x: node.x(),
                      y: node.y(),
                      width: node.width() * scaleX,
                      height: node.height() * scaleY,
                      rotation: node.rotation(),
                    });
                    
                    // Reset scale to prevent compounding
                    node.scaleX(1);
                    node.scaleY(1);
                  }}
                  ref={(node) => {
                    textRefs.current[box.id] = node;
                  }}
                />
              ))}
              
              <Transformer
                ref={transformerRef}
                boundBoxFunc={(oldBox, newBox) => {
                  // Limit resize to within stage bounds
                  if (newBox.width < 10 || newBox.height < 10) {
                    return oldBox;
                  }
                  return newBox;
                }}
              />
            </Layer>
          </Stage>
          
          <div className="canvas-actions">
            <button 
              className="btn btn-primary" 
              onClick={handleExport}
              disabled={!selectedImage}
            >
              Download Meme
            </button>
          </div>
        </>
      ) : (
        <div className="no-image-selected">
          <p>Select a template to start creating your meme</p>
        </div>
      )}
    </div>
  );
}

export default MemeCanvas;
