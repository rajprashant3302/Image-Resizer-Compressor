import { useState } from "react";
import UploadArea from "./components/UploadArea";
import CanvasArea from "./components/CanvasArea";
import ToolbarPanel from "./components/ToolbarPanel";
import ThumbnailBar from "./components/bottom/ThumbnailBar";

export default function App() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const serverUrl = "http://localhost:5000"; // change to your server

  // Handle images uploaded from server
  const handleUpload = (uploadedImages) => {
    setImages((prev) => [...prev, ...uploadedImages]);
    if (!selectedImage) setSelectedImage(uploadedImages[0]);
  };

  // Resize image on server
  const resizeImageOnServer = async (image, width, height) => {
    try {
      const res = await fetch(`${serverUrl}/resize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: image.serverFilename,
          width,
          height,
        }),
      });
      const data = await res.json();
      return data.processed; // URL of resized image
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // Compress image on server
  const compressImageOnServer = async (image, quality) => {
    try {
      const res = await fetch(`${serverUrl}/compress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: image.serverFilename,
          quality,
        }),
      });
      const data = await res.json();
      return data.processed; // URL of compressed image
    } catch (err) {
      console.error(err);
      return null;
    }
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
          images={images}
          serverUrl={serverUrl} // pass server URL
          resizeImageOnServer={resizeImageOnServer}
          compressImageOnServer={compressImageOnServer}
        />
      </div>

      <div className="flex-1 flex flex-col order-1 md:order-2">
        {!selectedImage ? (
          <UploadArea onUpload={handleUpload} maxFiles={50} serverUrl={serverUrl} />
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
