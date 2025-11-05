import React, { useRef, useState } from "react";

export default function UploadArea({ onUpload, maxFiles = 20 }) {
  const inputRef = useRef();
  const [warning, setWarning] = useState("");

  const handleFiles = (files) => {
    const arr = Array.from(files);
    const images = arr.filter((f) => f.type.startsWith("image/"));
    if (images.length === 0) {
      setWarning("Only images allowed");
      setTimeout(() => setWarning(""), 2000);
      return;
    }
    if (images.length > maxFiles) {
      setWarning(`Max ${maxFiles} files at once`);
      setTimeout(() => setWarning(""), 2000);
      return;
    }
    onUpload(images);
  };

  return (<div className="bg-white p-4 rounded-lg shadow-sm">
    <div
      onDrop={(e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
      }}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer h-96 hover:bg-gray-50"
      onClick={() => inputRef.current.click()}
    > <p className="text-gray-600">Drag & drop images here or click to browse</p> <p className="text-sm text-gray-400 mt-1">Max {maxFiles} images</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      /> </div>
    {warning && <p className="text-red-500 mt-4 text-sm">{warning}</p>} </div>
  );
}
