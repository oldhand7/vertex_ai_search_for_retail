
/* APIComparisonTool.js */
import React, { useState } from "react";
import VertexAIPage from "./VertexAIPage";
import SearchSpringPage from "./SearchSpringPage";

const APIComparisonTool = () => {
  const [query, setQuery] = useState("shirt");
  const [selectedFacets, setSelectedFacets] = useState({});

  return (
   <div className="container-fluid">
  <div className="row">
    {/* Left Section */}
    <div className="col-md-6" style={{ borderRight: "1px solid #ccc", padding: "20px" }}>
      <h3 className="text-center">Vertex AI Search</h3>
      <VertexAIPage
        query={query}
        setQuery={setQuery}
        selectedFacets={selectedFacets}
        setSelectedFacets={setSelectedFacets}
      />
    </div>

    {/* Right Section */}
    <div className="col-md-6" style={{ padding: "20px" }}>
      <h3 className="text-center">SearchSpring</h3>
      <SearchSpringPage
        query={query}
        setQuery={setQuery}
        selectedFacets={selectedFacets}
        setSelectedFacets={setSelectedFacets}
      />
    </div>
  </div>
</div>

  );
};

export default APIComparisonTool;
