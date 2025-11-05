import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function DownloadOptions({ selectedImage, editedImages, images }) {
  
  const handleDownloadSingle = () => {
    if (!selectedImage) return alert("Select an image first.");

    const file =
      editedImages[selectedImage.name]?.file || selectedImage.file;

    if (!file) return alert("No file available to download");

    saveAs(file, selectedImage.name);
  };

  
  const handleDownloadAll = async () => {
    const allImages = images || Object.values(editedImages);

    if (!allImages || allImages.length === 0)
      return alert("No images to download.");

    const zip = new JSZip();

    allImages.forEach((img) => {
      const file = img.file || editedImages[img.name]?.file;
      if (file) zip.file(img.name, file);
    });

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "images.zip");
  };

  return (
    <div className="space-y-3 mt-4">
      <h3 className="font-semibold text-gray-700">Download Options</h3>

      <button
        onClick={handleDownloadSingle}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Download Selected Image
      </button>

      <button
        onClick={handleDownloadAll}
        className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
      >
        Download All as ZIP
      </button>
    </div>
  );
}
