import React, { useState } from "react";
import CropTool from "./crop/CropTool";
import { FiCrop, FiEye } from "react-icons/fi";

export default function CanvasArea({ selectedImage, setSelectedImage, updateImage }) {
  const [showCrop, setShowCrop] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  if (!selectedImage) return null;


  const width = selectedImage.width || selectedImage.originalWidth || 800;
  const height = selectedImage.height || selectedImage.originalHeight || 800;

  return (
    <div className="relative w-full md:w-[70%] h-[500px] bg-gray-100 rounded-xl overflow-hidden flex flex-col">
      {/*Icons */}
      <div className="absolute top-2 right-2 flex gap-2 z-20">
        <button
          title="Crop"
          onClick={() => setShowCrop(true)}
          className="bg-black/50 p-2 rounded-md text-white hover:bg-black/70"
        >
          <FiCrop size={18} />
        </button>
        <button
          title="Toggle Original / Edited"
          onClick={() => setShowOriginal((prev) => !prev)}
          className="bg-black/50 p-2 rounded-md text-white hover:bg-black/70"
        >
          <FiEye size={18} />
        </button>
      </div>

      {/* Crop*/}
      {showCrop ? (
        <CropTool
          selectedImage={selectedImage}
          onCropComplete={(updated) => {
            setSelectedImage(updated); 
            updateImage?.(updated);    
            setShowCrop(false);        
          }}
          onCancel={() => setShowCrop(false)}
        />
      ) : (
        <img
          src={showOriginal ? selectedImage.originalUrl || selectedImage.url : selectedImage.url}
          alt={selectedImage.name}
          className="w-full h-full object-contain"
        />
      )}

      
      <div className="absolute bottom-2 left-2 text-white text-sm bg-black/50 px-2 py-1 rounded-md">
        {`${width} × ${height}`}
      </div>
    </div>
  );
}
