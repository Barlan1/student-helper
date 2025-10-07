import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

const BACKEND_URL = "https://3p8l34-3002.csb.app"; // replace with your sandbox backend URL
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [numPages, setNumPages] = useState(0);

  const fetchFiles = async () => {
    const res = await fetch(`${BACKEND_URL}/list`);
    const data = await res.json();
    setFiles(data.files);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Select a PDF first!");
    const formData = new FormData();
    formData.append("pdf", file);

    const res = await fetch(`${BACKEND_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const listRes = await fetch(`${BACKEND_URL}/list`);

    const data = await res.json();
    setMessage(data.message || "Uploaded!");
    setFile(null);
    fetchFiles();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Upload PDF</h2>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}

      <h3>Uploaded PDFs</h3>
      <ul>
        {files.length === 0 && <li>No PDFs uploaded yet</li>}
        {files.map((f) => (
          <li key={f.name}>
            <button onClick={() =>{ 
              console.log("Opening PDF:", `${BACKEND_URL}${f.url}`);
              setSelectedPdf(`${BACKEND_URL}${f.url}`)
            }}
             >
              {f.name}
            </button>{" "}
            <a
              href={`${BACKEND_URL}${f.url}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open
            </a>
          </li>
        ))}
      </ul>

      {selectedPdf && (
        <div style={{ marginTop: 20 }}>
          <h3>Viewing: {selectedPdf.split("/").pop()}</h3>
          <Document
            file={selectedPdf}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            {Array.from(new Array(numPages), (_, i) => (
              <Page key={i} pageNumber={i + 1} />
            ))}
          </Document>
        </div>
      )}
    </div>
  );
}

export default App;
