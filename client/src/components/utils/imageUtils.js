// Resize helper
export function resizeImage(file, width, height, maintainAspect = true) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        if (maintainAspect) {
          const aspect = img.width / img.height;
          if (width / height > aspect) {
            width = height * aspect;
          } else {
            height = width / aspect;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.9);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

// Crop helper
export function getCroppedImg(imageSrc, crop) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageSrc;
    img.crossOrigin = "anonymous"; // in case of CORS
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        img,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas is empty"));
      }, "image/jpeg");
    };
    img.onerror = reject;
  });
}


//resize by percentage
// Resize image by percentage
export function resizeImageByPercentage(file, percentage, onProgress) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        const scale = percentage / 100;
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);

        if (onProgress) onProgress(50);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        if (onProgress) onProgress(80);

        canvas.toBlob((blob) => {
          if (onProgress) onProgress(100);
          resolve(blob);
        }, "image/jpeg", 0.9);
      };

      img.onerror = reject;
    };

    reader.onerror = reject;
  });
}

