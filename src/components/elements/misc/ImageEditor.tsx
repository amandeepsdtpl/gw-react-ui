import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, RotateCcw, ZoomIn, ZoomOut, Crop, Move, Save, TimerReset as Reset } from 'lucide-react';

interface ImageEditorProps {
  src: string;
  width?: number;
  height?: number;
  onSave?: (editedImage: string) => void;
  className?: string;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({
  src,
  width = 600,
  height = 400,
  onSave,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isCropping, setIsCropping] = useState(false);
  const [cropStart, setCropStart] = useState({ x: 0, y: 0 });
  const [cropEnd, setCropEnd] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      setContext(ctx);

      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImage(img);
        drawImage(ctx, img);
      };
    }
  }, [src]);

  const drawImage = (
    ctx: CanvasRenderingContext2D | null,
    img: HTMLImageElement,
    customRotation = rotation,
    customScale = scale,
    customPosition = position
  ) => {
    if (!ctx || !img) return;

    ctx.clearRect(0, 0, width, height);
    ctx.save();

    // Transform context
    ctx.translate(width / 2 + customPosition.x, height / 2 + customPosition.y);
    ctx.rotate((customRotation * Math.PI) / 180);
    ctx.scale(customScale, customScale);

    // Draw image centered
    ctx.drawImage(
      img,
      -img.width / 2,
      -img.height / 2,
      img.width,
      img.height
    );

    ctx.restore();

    // Draw crop overlay if in cropping mode
    if (isCropping) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, width, height);
      
      const cropWidth = cropEnd.x - cropStart.x;
      const cropHeight = cropEnd.y - cropStart.y;
      
      ctx.clearRect(
        cropStart.x,
        cropStart.y,
        cropWidth,
        cropHeight
      );
      
      ctx.strokeStyle = '#fff';
      ctx.strokeRect(
        cropStart.x,
        cropStart.y,
        cropWidth,
        cropHeight
      );
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isCropping) {
      setCropStart({ x, y });
      setCropEnd({ x, y });
    } else {
      setIsDragging(true);
      setDragStart({ x: x - position.x, y: y - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isCropping) {
      setCropEnd({ x, y });
      drawImage(context, image!);
    } else if (isDragging) {
      const newPosition = {
        x: x - dragStart.x,
        y: y - dragStart.y,
      };
      setPosition(newPosition);
      drawImage(context, image!, rotation, scale, newPosition);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (isCropping) {
      applyCrop();
    }
  };

  const rotateLeft = () => {
    const newRotation = (rotation - 90) % 360;
    setRotation(newRotation);
    drawImage(context, image!, newRotation, scale, position);
  };

  const rotateRight = () => {
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
    drawImage(context, image!, newRotation, scale, position);
  };

  const zoomIn = () => {
    const newScale = scale * 1.1;
    setScale(newScale);
    drawImage(context, image!, rotation, newScale, position);
  };

  const zoomOut = () => {
    const newScale = scale * 0.9;
    setScale(newScale);
    drawImage(context, image!, rotation, newScale, position);
  };

  const toggleCrop = () => {
    setIsCropping(!isCropping);
    if (isCropping) {
      drawImage(context, image!);
    }
  };

  const applyCrop = () => {
    if (!context || !image) return;

    const cropWidth = Math.abs(cropEnd.x - cropStart.x);
    const cropHeight = Math.abs(cropEnd.y - cropStart.y);
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = cropWidth;
    tempCanvas.height = cropHeight;
    
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCtx.drawImage(
      canvasRef.current!,
      Math.min(cropStart.x, cropEnd.x),
      Math.min(cropStart.y, cropEnd.y),
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    const croppedImage = new Image();
    croppedImage.src = tempCanvas.toDataURL();
    croppedImage.onload = () => {
      setImage(croppedImage);
      setIsCropping(false);
      setRotation(0);
      setScale(1);
      setPosition({ x: 0, y: 0 });
      drawImage(context, croppedImage, 0, 1, { x: 0, y: 0 });
    };
  };

  const handleSave = () => {
    if (canvasRef.current && onSave) {
      onSave(canvasRef.current.toDataURL());
    }
  };

  const handleReset = () => {
    if (image) {
      setRotation(0);
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setIsCropping(false);
      drawImage(context, image, 0, 1, { x: 0, y: 0 });
    }
  };

  return (
    <div className={`image-editor ${className}`}>
      <div className="image-editor-canvas">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: isCropping ? 'crosshair' : isDragging ? 'grabbing' : 'grab' }}
        />
      </div>
      
      <div className="image-editor-toolbar">
        <button
          className="image-editor-tool"
          onClick={rotateLeft}
          title="Rotate Left"
        >
          <RotateCcw size={20} />
        </button>
        <button
          className="image-editor-tool"
          onClick={rotateRight}
          title="Rotate Right"
        >
          <RotateCw size={20} />
        </button>
        <button
          className="image-editor-tool"
          onClick={zoomIn}
          title="Zoom In"
        >
          <ZoomIn size={20} />
        </button>
        <button
          className="image-editor-tool"
          onClick={zoomOut}
          title="Zoom Out"
        >
          <ZoomOut size={20} />
        </button>
        <button
          className={`image-editor-tool ${isCropping ? 'active' : ''}`}
          onClick={toggleCrop}
          title="Crop"
        >
          <Crop size={20} />
        </button>
        <button
          className="image-editor-tool"
          onClick={handleReset}
          title="Reset"
        >
          <Reset size={20} />
        </button>
        <button
          className="image-editor-tool"
          onClick={handleSave}
          title="Save"
        >
          <Save size={20} />
        </button>
      </div>

      <style jsx>{`
        .image-editor {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem;
          background-color: var(--background);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-sm);
        }

        .image-editor-canvas {
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius);
          overflow: hidden;
        }

        .image-editor-canvas canvas {
          display: block;
          max-width: 100%;
          height: auto;
        }

        .image-editor-toolbar {
          display: flex;
          gap: 0.5rem;
          padding: 0.5rem;
          background-color: #f8fafc;
          border-radius: var(--border-radius);
        }

        .image-editor-tool {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          padding: 0.5rem;
          border: none;
          background: none;
          color: var(--text-secondary);
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--transition);
        }

        .image-editor-tool:hover {
          background-color: #f1f5f9;
          color: var(--text-primary);
        }

        .image-editor-tool.active {
          background-color: var(--primary-color);
          color: white;
        }
      `}</style>
    </div>
  );
};