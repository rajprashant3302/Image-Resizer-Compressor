import { useState } from "react";
import UploadArea from "./components/UploadArea";
import CanvasArea from "./components/CanvasArea";
import ToolbarPanel from "./components/ToolbarPanel";
import ThumbnailBar from "./components/bottom/ThumbnailBar";

export default function App() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editedImages, setEditedImages] = useState({});


  const handleUpload = (files) => {
  files.forEach((file) => {
    const img = new Image();
    img.onload = () => {
      const newImage = {
        file: file,
        name: file.name,
        url: URL.createObjectURL(file),
        originalUrl: URL.createObjectURL(file),
        width: img.width,
        height: img.height,
      };
      setImages((prev) => [...prev, newImage]);
      if (!selectedImage) setSelectedImage(newImage);
    };
    img.src = URL.createObjectURL(file);
  });
};



  const updateImage = (updatedImage) => {
    setImages((prev) =>
      prev.map((img) => (img.name === updatedImage.name ? updatedImage : img))
    );
    if (selectedImage?.name === updatedImage.name) {
      setSelectedImage(updatedImage);
    }
  };


  const removeImage = (imageName) => {
    setImages((prev) => prev.filter((img) => img.name !== imageName));
    if (selectedImage?.name === imageName) {
      const remaining = images.filter((img) => img.name !== imageName);
      setSelectedImage(remaining[0] || null);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">

      <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-r md:border-b-0 border-gray-200 flex-shrink-0 order-2 md:order-1 overflow-y-auto">
        <ToolbarPanel
          selectedImage={selectedImage}
          updateImage={updateImage}
          editedImages={editedImages}
          setEditedImages={setEditedImages}
          images={images}
        />
      </div>


      <div className="flex-1 flex flex-col order-1 md:order-2">
        {!selectedImage ? (
          <UploadArea onUpload={handleUpload} maxFiles={50} />
        ) : (
          <CanvasArea
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            updateImage={updateImage}
          />
        )}


        <ThumbnailBar
          images={images}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          onRemove={removeImage}
        />
      </div>
    </div>
  );
}
