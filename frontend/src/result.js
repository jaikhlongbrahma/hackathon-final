// import { useLocation, useNavigate } from "react-router-dom";

// function Result() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const result = location.state?.result;

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Explanation</h2>

//       {result ? (
//         <pre style={{ whiteSpace: "pre-wrap" }}>{result}</pre>
//       ) : (
//         <p>No result found</p>
//       )}

//       <br />
//       <button onClick={() => navigate("/")}>Back</button>
//     </div>
//   );
// }

// export default Result;

import { useLocation, useNavigate } from "react-router-dom";
import "./result.css";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  return (
    <div className="result-page">
      <div className="result-card">
        <h1 className="title">Medical Explanation</h1>

        {!result ? (
          <p>No result found</p>
        ) : (
          <div className="result-content">
            {result.split("\n").map((line, index) => {
              // Section headings styling
              if (
                line.toLowerCase().includes("summary") ||
                line.toLowerCase().includes("key points") ||
                line.toLowerCase().includes("what it may indicate") ||
                line.toLowerCase().includes("advice")
              ) {
                return (
                  <h3 key={index} className="section-title">
                    {line}
                  </h3>
                );
              }

              return (
                <p key={index} className="line">
                  {line}
                </p>
              );
            })}
          </div>
        )}

        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back
        </button>
      </div>
    </div>
  );
}

export default Result;