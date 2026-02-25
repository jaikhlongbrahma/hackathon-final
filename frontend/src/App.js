// // import { useNavigate } from "react-router-dom";
// // import React, { useState } from "react";
// // import axios from "axios";
// // import Tesseract from "tesseract.js";

// // function App() {
// //   const navigate = useNavigate();
// //   const [image, setImage] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [result, setResult] = useState("");
// //   const [language, setLanguage] = useState("English");

// //   // Handle OCR + Send to backend
// //   const handleProcess = async () => {
// //     if (!image) {
// //       alert("Please upload an image first");
// //       return;
// //     }

// //     setLoading(true);
// //     setResult("");

// //     try {
// //       // Step 1: OCR
// //       const { data: { text } } = await Tesseract.recognize(
// //         image,
// //         "eng",
// //         {
// //           logger: (m) => console.log(m)
// //         }
// //       );

// //       console.log("Extracted text:", text);

// //       // Step 2: Send to backend
// //       const res = await axios.post("http://localhost:5000/explain", {
// //         text: text,
// //         language: language
// //       });

// //       setResult(res.data.explanation);
// //     } catch (err) {
// //       console.error(err);
// //       setResult("Error processing image");
// //     }

// //     setLoading(false);
// //   };

// //   return (
// //     <div style={{ padding: 20 }}>
// //       <h2>Medical Report Explainer</h2>

// //       {/* Language Selection */}
// //       <label>Select Language: </label>
// //       <select
// //         value={language}
// //         onChange={(e) => setLanguage(e.target.value)}
// //       >
// //         <option>English</option>
// //         <option>Hindi</option>
// //         <option>Bodo</option>
// //       </select>

// //       <br /><br />

// //       {/* Image Upload */}
// //       <input
// //         type="file"
// //         accept="image/*"
// //         onChange={(e) => setImage(e.target.files[0])}
// //       />

// //       <br /><br />

// //       {/* Button */}
// //       <button onClick={handleProcess}>
// //         Extract & Explain
// //       </button>

// //       <br /><br />

// //       {/* Loading */}
// //       {loading && <p>Reading report... Please wait</p>}

// //       {/* Result */}
// //       {result && (
// //         <div>
// //           <h3>Result:</h3>
// //           <pre style={{ whiteSpace: "pre-wrap" }}>{result}</pre>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default App;


import "./App.css";
import React, { useState } from "react";
import axios from "axios";
import Tesseract from "tesseract.js";
import { Routes, Route, useNavigate } from "react-router-dom";
import Result from "./result";

function UploadPage() {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [textInput, setTextInput] = useState("");
  const [loading, setLoading] = useState(false);
  <h2 className="title">Medical Report Explainer</h2>
  const [language, setLanguage] = useState("English");

  const handleProcess = async () => {
    if (!image && !textInput.trim()) {
      alert("Upload image or write text");
      return;
    }

    setLoading(true);

    try {
      let extractedText = textInput;

      // OCR if image exists
      if (image) {
        const { data: { text } } = await Tesseract.recognize(
          image,
          "eng"
        );
        extractedText = text;
      }

      // Backend call
      const res = await axios.post("http://localhost:5000/explain", {
        text: extractedText,
        language: language
      });

      // Go to result page
      navigate("/result", {
        state: { result: res.data.explanation }
      });

    } catch (err) {
      console.error(err);
      alert("Processing failed");
    }

    setLoading(false);
  };

  return (
    <div className="page">

      {/* Language */}
      <div className="language-bar">
        <button
          className={`lang ${language === "English" ? "active" : ""}`}
          onClick={() => setLanguage("English")}
        >
          English
        </button>

        <button
          className={`lang ${language === "Hindi" ? "active" : ""}`}
          onClick={() => setLanguage("Hindi")}
        >
          Hindi
        </button>

        <button
          className={`lang ${language === "Bodo" ? "active" : ""}`}
          onClick={() => setLanguage("Bodo")}
        >
          Bodo
        </button>
      </div>

      {/* Card */}
      <div className="card">

        <textarea
          className="input-box"
          placeholder="Upload or write your report"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
        />

        <div className="actions">

          {/* Attach */}
          <label className="attach">
            +
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImage(file);
                  setFileName(file.name);
                }
              }}
            />
          </label>

          {/* File name */}
          {fileName && (
            <span className="filename">
              {fileName}
            </span>
          )}

          {/* Send */}
          <button
            className="send"
            onClick={handleProcess}
            disabled={loading}
          >
            {loading ? <div className="spinner"></div> : "↑"}
          </button>

        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<UploadPage />} />
      <Route path="/result" element={<Result />} />
    </Routes>
  );
}

export default App;


