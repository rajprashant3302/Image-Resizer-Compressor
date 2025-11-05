import express from "express";
import multer from "multer";
import sharp from "sharp";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// --- Upload endpoint (keeps original files) ---
app.post("/upload", upload.array("images"), async (req, res) => {
try {
const results = req.files.map((file) => ({
fileName: file.originalname,
originalSize: file.size,
fileUrl: `data:image/jpeg;base64,${file.buffer.toString("base64")}`,
}));
res.json(results);
} catch (err) {
console.error(err);
res.status(500).json({ error: "Upload failed" });
}
});

// --- Resize/compress endpoint ---
app.post("/process", upload.array("images"), async (req, res) => {
try {
const { width, height, quality } = req.body;
const results = [];


for (const file of req.files) {
  const originalSize = file.size;

  const outputBuffer = await sharp(file.buffer)
    .resize(Number(width) || null, Number(height) || null, { fit: "inside" })
    .jpeg({ quality: Number(quality) || 80 })
    .toBuffer();

  const newSize = outputBuffer.length;

  results.push({
    fileName: file.originalname,
    optimizedImage: `data:image/jpeg;base64,${outputBuffer.toString("base64")}`,
    metrics: { originalSize, newSize },
  });
}

res.json(results);


} catch (err) {
console.error(err);
res.status(500).json({ error: "Processing failed" });
}
});

app.listen(5000, () => console.log("✅ Server running on [http://localhost:5000](http://localhost:5000)"));
