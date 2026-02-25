
import React, { useState } from "react";
import axios from "axios";
import Tesseract from "tesseract.js";

function App() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [language, setLanguage] = useState("English");

  // Handle OCR + Send to backend
  const handleProcess = async () => {
    if (!image) {
      alert("Please upload an image first");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      // Step 1: OCR
      const { data: { text } } = await Tesseract.recognize(
        image,
        "eng",
        {
          logger: (m) => console.log(m)
        }
      );

      console.log("Extracted text:", text);

      // Step 2: Send to backend
      const res = await axios.post("http://localhost:5000/explain", {
        text: text,
        language: language
      });

      setResult(res.data.explanation);
    } catch (err) {
      console.error(err);
      setResult("Error processing image");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Medical Report Explainer</h2>

      {/* Language Selection */}
      <label>Select Language: </label>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option>English</option>
        <option>Hindi</option>
        <option>Bodo</option>
      </select>

      <br /><br />

      {/* Image Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <br /><br />

      {/* Button */}
      <button onClick={handleProcess}>
        Extract & Explain
      </button>

      <br /><br />

      {/* Loading */}
      {loading && <p>Reading report... Please wait</p>}

      {/* Result */}
      {result && (
        <div>
          <h3>Result:</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>{result}</pre>
        </div>
      )}
    </div>
  );
}

export default App;