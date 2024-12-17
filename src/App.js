/* App.js */
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import APIComparisonTool from "./APIComparisonTool";
import "./APIComparisonTool.css";

const App = () => {
  const [query, setQuery] = useState("shirt");
  const [selectedFacets, setSelectedFacets] = useState({});

  const handleInputChange = (e) => setQuery(e.target.value);

  const clearSelectedFacets = () => setSelectedFacets({});

  return (
    <div className="App ">
      <h1 className="text-center mt-4 mb-4">Search API Comparison Tool</h1>

      {/* Search Input Section */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Enter search query..."
            value={query}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-primary w-100"
            onClick={() => setQuery(query.trim())}
            disabled={!query.trim()}
          >
            Search
          </button>
        </div>
      </div>

      {/* Display Selected Facets */}
      {Object.keys(selectedFacets).length > 0 && (
        <div className="row mb-4">
          <div className="col">
            <div className="card">
              <div className="card-header bg-secondary text-white">
                <strong>Selected Facets</strong>
                <button
                  className="btn btn-sm btn-light float-end"
                  onClick={clearSelectedFacets}
                >
                  Clear All
                </button>
              </div>
              <div className="card-body">
                <ul className="list-group">
                  {Object.entries(selectedFacets).map(([key, values]) => (
                    <li key={key} className="list-group-item">
                      <strong>{key}:</strong> {values.join(", ")}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Comparison Tool */}
      <APIComparisonTool
        query={query}
        setQuery={setQuery}
        selectedFacets={selectedFacets}
        setSelectedFacets={setSelectedFacets}
      />
    </div>
  );
};

export default App;
