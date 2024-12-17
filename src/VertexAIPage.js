/* VertexAIPage.js */
import React, { useState, useEffect } from "react";

const VertexAIPage = ({ query, setQuery, selectedFacets, setSelectedFacets }) => {
    const [vertexAIResults, setVertexAIResults] = useState([]);
    const [vertexAIPage, setVertexAIPage] = useState(1);
    const [vertexPaginationInfo, setVertexPaginationInfo] = useState({});
    const [vertexExecutionTime, setVertexExecutionTime] = useState(0);
    const [vertexFacets, setVertexFacets] = useState([]);
    const [expandedFacets, setExpandedFacets] = useState({});

    const buildFilterFromFacets = () => {
        let filterParts = [];
        Object.keys(selectedFacets).forEach((facetKey) => {
            const facetValues = selectedFacets[facetKey];
            if (facetValues && facetValues.length > 0) {
                const values = facetValues.map((value) => `"${value}"`).join(",");
                filterParts.push(`${facetKey}:ANY(${values})`);
            }
        });
        return filterParts.join(" AND ");
    };

    const handleFacetChange = (facetKey, value) => {
        setSelectedFacets((prev) => {
            const updatedFacets = { ...prev };
            if (!updatedFacets[facetKey]) {
                updatedFacets[facetKey] = [];
            }
            if (updatedFacets[facetKey].includes(value)) {
                updatedFacets[facetKey] = updatedFacets[facetKey].filter((v) => v !== value);
            } else {
                updatedFacets[facetKey].push(value);
            }
            return updatedFacets;
        });
        fetchVertexAIResults();
    };

    const fetchVertexAIResults = async () => {
        const startTime = performance.now();
        const payload = {
            query,
            filter: buildFilterFromFacets()
        };
        const url = `https://main-pagination-dynamic-facet-demo-295037490706.us-central1.run.app/search?offset=${(vertexAIPage - 1) * 10}`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Vertex AI API returned status ${response.status}`);
            }

            const data = await response.json();
            const endTime = performance.now();

            setVertexAIResults(data.results || []);
            setVertexExecutionTime((endTime - startTime).toFixed(2));
            setVertexPaginationInfo({
                totalProducts: data.total_products || 0,
                pageCount: data.page_count || 1
            });
            setVertexFacets(data.facets || []);
        } catch (error) {
            console.error("Error fetching Vertex AI results:", error);
            setVertexAIResults([]);
        }
    };

    useEffect(() => {
        fetchVertexAIResults();
    }, [vertexAIPage, selectedFacets]);

    const toggleFacetExpansion = (facetKey) => {
        setExpandedFacets((prev) => ({
            ...prev,
            [facetKey]: !prev[facetKey]
        }));
    };

    const renderFacets = () => {
        return vertexFacets.map((facet, index) => (
            <div key={index} className="card mb-3">
                <div
                    className="card-header d-flex justify-content-between align-items-center cursor-pointer"
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleFacetExpansion(facet.facet_key)}
                >
                    <strong>
                        {facet.facet_key
                            .replace(/^attributes\./, 'Att ')
                            .replace(/_/g, ' ')}
                    </strong>
                    <span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className={`bi bi-chevron-${expandedFacets[facet.facet_key] ? "up" : "down"}`}
                            viewBox="0 0 16 16"
                        >
                            {expandedFacets[facet.facet_key] ? (
                                <path
                                    fillRule="evenodd"
                                    d="M1.646 11.854a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708 0z"
                                />
                            ) : (
                                <path
                                    fillRule="evenodd"
                                    d="M1.646 4.146a.5.5 0 0 1 .708 0L8 9.793l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                                />
                            )}
                        </svg>
                    </span>
                </div>
                {expandedFacets[facet.facet_key] && (
                    <div className="card-body">
                        {facet.facet_values.map((facetValue, idx) => {
                            let rangeLabel = ""; // Label for display

                            if (facetValue.interval) {
                                // Interval-based payload
                                const { min, max } = facetValue.interval;
                                rangeLabel = `${min} - ${max}`;
                            } else if (facetValue.value) {
                                // Value-based payload
                                rangeLabel = facetValue.value;
                            }

                            return (
                                <div key={idx} className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id={`vertex-${facet.facet_key}-${idx}`}
                                        checked={
                                            selectedFacets[facet.facet_key]?.some((item) => {
                                                if (facetValue.interval) {
                                                    return item.min === facetValue.interval.min && item.max === facetValue.interval.max;
                                                } else {
                                                    return item === facetValue.value;
                                                }
                                            }) || false
                                        }
                                        onChange={() => {
                                            if (facetValue.interval) {
                                                handleFacetChange(facet.facet_key, { min: facetValue.interval.min, max: facetValue.interval.max });
                                            } else {
                                                handleFacetChange(facet.facet_key, facetValue.value);
                                            }
                                        }}
                                    />
                                    <label
                                        htmlFor={`vertex-${facet.facet_key}-${idx}`}
                                        className="form-check-label"
                                    >
                                        {rangeLabel} <span className="badge bg-secondary">{facetValue.count}</span>
                                    </label>
                                </div>
                            );
                        })}


                    </div>
                )}
            </div>

        ));
    };

    return (
        <div className="row">
            <div className="col-md-12">
                <h3 className="text-center">Vertex AI Search Results</h3>
                <div className="text-center mb-2">Execution Time: {vertexExecutionTime} ms</div>
            </div>
            <div className="col-md-4">{renderFacets()}</div>
            <div className="col-md-8">

                {vertexAIResults.map((product, index) => (
                    <div key={index} className="product-card card mb-3">
                        <div className="d-flex">
                            <img
                                src={product.image || "https://via.placeholder.com/150"} // Replace with actual image source key
                                alt={product.name}
                                className="img-thumbnail me-3"
                                style={{ width: "150px", height: "auto" }}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{product.brand}</h5>
                                <p className="card-text">{product.name}</p>
                                <p className="card-text">Price: ${product.price}</p>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="text-center">
                    <button
                        className="btn btn-secondary mx-2"
                        onClick={() => setVertexAIPage(vertexAIPage - 1)}
                        disabled={vertexAIPage <= 1}
                    >
                        Previous Page
                    </button>
                    <button
                        className="btn btn-secondary mx-2"
                        onClick={() => setVertexAIPage(vertexAIPage + 1)}
                        disabled={vertexAIPage >= vertexPaginationInfo.pageCount}
                    >
                        Next Page
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VertexAIPage;