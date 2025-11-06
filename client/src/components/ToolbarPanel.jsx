import { useState } from "react";
import Tabs from "./common/Tabs";
import ResizeSection from "./resize/ResizeSection";
import CompressionOptions from "./compression/CompressionOptions";
import DownloadOptions from "./download/DownloadOptions";



export default function ToolbarPanel({ selectedImage, updateImage, editedImages, setEditedImages ,images }) {

  const serverUrl=import.meta.env.VITE_SERVER_URL;
const [activeTab, setActiveTab] = useState("Resize");
const [resizeMode, setResizeMode] = useState("size"); 

if (!selectedImage) return null;

return ( <div className="p-4"> <h2 className="text-lg font-semibold mb-3 text-gray-700">Image Settings</h2>


 
  <Tabs
    tabs={["Resize", "Compression", "Download"]}
    activeTab={activeTab}
    setActiveTab={setActiveTab}
  />

  <div className="mt-4">
    {activeTab === "Resize" && (
      <div>
     
        <div className="flex gap-2 mb-3">
          {["size", "percent", "social"].map((mode) => (
            <button
              key={mode}
              onClick={() => setResizeMode(mode)}
              className={`px-3 py-1 rounded-md ${
                resizeMode === mode ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              {mode === "size" ? "By Size" : mode === "percent" ? "By Percentage" : "Social Media"}
            </button>
          ))}
        </div>

        
        <ResizeSection
          selectedImage={selectedImage}
          resizeMode={resizeMode}
          updateImage={updateImage}
          serverUrl={serverUrl}
        />
      </div>
    )}

    {activeTab === "Compression" && (
      <CompressionOptions selectedImage={selectedImage} updateImage={updateImage} serverUrl={serverUrl}/>
    )}

  {activeTab === "Download" && (
  <DownloadOptions
    selectedImage={selectedImage}
    editedImages={editedImages}
    images={images} 
    serverUrl={serverUrl}
  />
)}

  </div>
</div>


);
}
