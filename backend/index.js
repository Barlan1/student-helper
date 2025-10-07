import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

// Enable CORS
app.use(cors({
  origin:"*",
  methods:["GET","POST"],
  allowedHeaders:["content-type"],
})
);

// Ensure uploads folder exists
const uploadsFolder = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsFolder)) fs.mkdirSync(uploadsFolder);

// Serve uploaded files
app.use("/uploads", express.static(uploadsFolder, {
  setHeaders: (res) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  },
}));

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsFolder),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Routes
app.get("/", (req, res) => res.send("Backend running"));

app.post("/upload", upload.single("pdf"), (req, res) => {
  console.log("📄 Uploaded file:", req.file); // check if file is received
  res.json({ message: "File uploaded successfully!", file: req.file });
});

app.get("/list", (req, res) => {
  const files = fs
    .readdirSync(uploadsFolder)
    .filter((f) => f.endsWith(".pdf"))
    .map((f) => ({ name: f, url: `/uploads/${f}` }));
  res.json({ files });
});

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Backend running on port ${PORT}`)
);
