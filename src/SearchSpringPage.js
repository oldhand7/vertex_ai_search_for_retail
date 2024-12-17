
/* SearchSpringPage.js */
import React, { useState, useEffect } from "react";

const SearchSpringPage = ({ query, setQuery, selectedFacets, setSelectedFacets }) => {
  const [searchSpringResults, setSearchSpringResults] = useState([]);
  const [searchSpringPage, setSearchSpringPage] = useState(1);
  const [searchSpringPaginationInfo, setSearchSpringPaginationInfo] = useState({});
  const [searchSpringExecutionTime, setSearchSpringExecutionTime] = useState(0);
  const [searchSpringFacets, setSearchSpringFacets] = useState([]);
  const [expandedFacets, setExpandedFacets] = useState({});

  const fetchSearchSpringResults = async () => {
    const startTime = performance.now();
    const url = `https://pk5g8d.a.searchspring.io/api/search/search.json?siteId=pk5g8d&resultsFormat=json&q=${query}&resultsPerPage=10&page=${searchSpringPage}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      const endTime = performance.now();

      setSearchSpringResults(data.results || []);
      setSearchSpringExecutionTime((endTime - startTime).toFixed(2));
      setSearchSpringPaginationInfo(data.pagination || {});
      setSearchSpringFacets(data.facets || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSearchSpringResults();
  }, [searchSpringPage, selectedFacets]);

  const toggleFacetExpansion = (facetKey) => {
    setExpandedFacets((prev) => ({
      ...prev,
      [facetKey]: !prev[facetKey]
    }));
  };

  const renderFacets = () => {
    return searchSpringFacets.map((facet, index) => (
      <div key={index} className="card mb-3">
        <div className="card-header " style={{cursor: "pointer"}} onClick={() => toggleFacetExpansion(facet.field)}>
          <strong>{facet.label}</strong>
        </div>
        {expandedFacets[facet.field] && (
          <div className="card-body">
            {facet.values.map((value, idx) => (
              <div key={idx} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  onChange={() => setSelectedFacets(value)}
                />
                <label className="form-check-label">{value.label}</label>
              </div>
            ))}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="row">
      <div className="col-md-12">
      <h3 className="text-center">SearchSpring Results</h3>
      <div className="text-center mb-2">Execution Time: {searchSpringExecutionTime} ms</div>
      </div>
      <div className="col-md-4">{renderFacets()}</div>
      <div className="col-md-8">

        {searchSpringResults.map((product, index) => (
          <div key={index} className="product-card card mb-3">
       
            <div className="d-flex">
              <img
                src={product.secureImageUrl || "https://via.placeholder.com/150"} // Replace with actual image source key
                alt={product.brand}
                className="img-thumbnail me-3"
                style={{ width: "150px", height: "auto" }}
              />
              <div className="card-body">
                <h5 className="card-title">{product.brand}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text">Price: ${product.price}</p>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchSpringPage;
