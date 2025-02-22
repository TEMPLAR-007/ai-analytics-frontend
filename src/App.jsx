
// // import { useState, useEffect, useRef } from "react";
// // import { Chart } from "chart.js/auto";
// // import axios from "axios";

// // function App() {
// //   const [file, setFile] = useState(null);
// //   const [query, setQuery] = useState("");
// //   const [responseData, setResponseData] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");
// //   const chartRef = useRef(null);

// //   // Handle file upload
// //   const handleFileChange = (e) => {
// //     setFile(e.target.files[0]);
// //   };

// //   // Handle query submission
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!file || !query) {
// //       setError("Please upload a file and enter a query.");
// //       return;
// //     }

// //     setLoading(true);
// //     setError("");

// //     try {
// //       // Step 1: Upload the file
// //       const formData = new FormData();
// //       formData.append("file", file);

// //       const uploadResponse = await axios.post("http://localhost:3000/upload", formData, {
// //         headers: { "Content-Type": "multipart/form-data" },
// //       });

// //       if (uploadResponse.data.message === "File uploaded successfully") {
// //         // Step 2: Send the query to the backend
// //         const queryResponse = await axios.post("http://localhost:3000/query", { query });
// //         setResponseData(queryResponse.data); // Set the response data
// //       }
// //     } catch (err) {
// //       console.error("Error:", err);
// //       setError("Failed to process the request. Please try again.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Render the chart
// //   useEffect(() => {
// //     if (!responseData || !responseData.chart || !chartRef.current) return;

// //     // Destroy existing chart if it exists
// //     if (chartRef.current.chart) {
// //       chartRef.current.chart.destroy();
// //     }

// //     // Create new chart
// //     const { title, type, labels, datasets } = responseData.chart;
// //     const ctx = chartRef.current.getContext("2d");
// //     chartRef.current.chart = new Chart(ctx, {
// //       type: type,
// //       data: {
// //         labels: labels,
// //         datasets: datasets,
// //       },
// //       options: {
// //         responsive: true,
// //         plugins: {
// //           title: {
// //             display: true,
// //             text: title,
// //           },
// //         },
// //       },
// //     });

// //     // Cleanup
// //     return () => {
// //       if (chartRef.current.chart) {
// //         chartRef.current.chart.destroy();
// //       }
// //     };
// //   }, [responseData]);

// //   return (
// //     <div className="app-container">
// //       <h1>AI Data Analyzer</h1>

// //       <form onSubmit={handleSubmit} className="form-container">
// //         <div className="form-group">
// //           <label htmlFor="file">Upload Excel File:</label>
// //           <input
// //             type="file"
// //             id="file"
// //             accept=".xlsx"
// //             onChange={handleFileChange}
// //             required
// //           />
// //         </div>

// //         <div className="form-group">
// //           <label htmlFor="query">Enter Query:</label>
// //           <input
// //             type="text"
// //             id="query"
// //             value={query}
// //             onChange={(e) => setQuery(e.target.value)}
// //             placeholder="e.g., Show total quantity, chart, and filtered data for electronics"
// //             required
// //           />
// //         </div>

// //         <button type="submit" disabled={loading} className="submit-btn">
// //           {loading ? "Processing..." : "Analyze Data"}
// //         </button>
// //       </form>

// //       {error && <p className="error-message">{error}</p>}

// //       {responseData && (
// //         <div className="result-container">


// //           {responseData.total_quantity && (
// //             <div className="calculation-result">
// //               <h3>Total Quantity of Electronics Items</h3>
// //               <p className="result-value">{responseData.total_quantity}</p>
// //             </div>
// //           )}
// //           {/* Total Quantity */}
// //           {responseData.total_quantity && (
// //             <div className="calculation-result">
// //               <h3>Total Quantity of Electronics Items</h3>
// //               <p className="result-value">{responseData.total_quantity}</p>
// //             </div>
// //           )}

// //           {/* Chart */}
// //           {responseData.chart && (
// //             <div className="chart-wrapper">
// //               <canvas ref={chartRef} width="400" height="200"></canvas>
// //             </div>
// //           )}

// //           {/* Filtered Data Table */}
// //           {responseData.filtered_data && (
// //             <div className="table-wrapper">
// //               <h3>Filtered Electronics Items</h3>
// //               <table>
// //                 <thead>
// //                   <tr>
// //                     {Object.keys(responseData.filtered_data[0]).map((header) => (
// //                       <th key={header}>{header}</th>
// //                     ))}
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {responseData.filtered_data.map((row, index) => (
// //                     <tr key={index}>
// //                       {Object.values(row).map((value, idx) => (
// //                         <td key={idx}>{value}</td>
// //                       ))}
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default App;









































// import { useState, useEffect, useRef } from "react";
// import { Chart } from "chart.js/auto";
// import axios from "axios";

// function App() {
//   const [file, setFile] = useState(null);
//   const [query, setQuery] = useState("");
//   const [responseData, setResponseData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const chartRef = useRef(null);

//   // Handle file upload
//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   // Handle query submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file || !query) {
//       setError("Please upload a file and enter a query.");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       // Step 1: Upload the file
//       const formData = new FormData();
//       formData.append("file", file);

//       const uploadResponse = await axios.post("http://localhost:3000/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (uploadResponse.data.message === "File uploaded successfully") {
//         // Step 2: Send the query to the backend
//         const queryResponse = await axios.post("http://localhost:3000/query", { query });
//         setResponseData(queryResponse.data); // Set the response data
//       }
//     } catch (err) {
//       console.error("Error:", err);
//       setError("Failed to process the request. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };





//   const renderContent = () => {
//     if (!responseData) return null;

//     return Object.entries(responseData).map(([key, value]) => {
//       // Case 1: Chart Data
//       if (key === "chart" && value?.type && value?.datasets) {
//         return (
//           <div key={key} className="chart-wrapper">
//             <canvas ref={chartRef} width="400" height="200"></canvas>
//           </div>
//         );
//       }

//       // Case 2: Filtered Data (Array of Objects)
//       if (Array.isArray(value)) {
//         return (
//           <div key={key} className="table-wrapper">
//             <h3>{key.replace(/_/g, " ").toUpperCase()}</h3>
//             <table>
//               <thead>
//                 <tr>
//                   {Object.keys(value[0]).map((header) => (
//                     <th key={header}>{header}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {value.map((row, index) => (
//                   <tr key={index}>
//                     {Object.values(row).map((cell, idx) => (
//                       <td key={idx}>{cell}</td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         );
//       }

//       // Case 3: Calculative Data (Key-Value Pairs)
//       if (typeof value === "object" && !Array.isArray(value)) {
//         return (
//           <div key={key} className="calculative-data">
//             <h3>{key.replace(/_/g, " ").toUpperCase()}</h3>
//             <div className="data-grid">
//               {Object.entries(value).map(([subKey, subValue]) => (
//                 <div key={subKey} className="data-item">
//                   <strong>{subKey.replace(/_/g, " ")}:</strong> {subValue}
//                 </div>
//               ))}
//             </div>
//           </div>
//         );
//       }

//       // Case 4: Simple Key-Value (e.g., total_sales: 1000)
//       return (
//         <div key={key} className="simple-data">
//           <strong>{key.replace(/_/g, " ")}:</strong> {value}
//         </div>
//       );
//     });
//   };







//   // Render the chart
//   useEffect(() => {
//     if (!responseData || !responseData.chart || !chartRef.current) return;

//     // Destroy existing chart if it exists
//     if (chartRef.current.chart) {
//       chartRef.current.chart.destroy();
//     }

//     // Create new chart
//     const { title, type, labels, datasets } = responseData.chart;
//     const ctx = chartRef.current.getContext("2d");
//     chartRef.current.chart = new Chart(ctx, {
//       type: type,
//       data: {
//         labels: labels,
//         datasets: datasets,
//       },
//       options: {
//         responsive: true,
//         plugins: {
//           title: {
//             display: true,
//             text: title,
//           },
//         },
//       },
//     });

//     // Cleanup
//     return () => {
//       if (chartRef.current.chart) {
//         chartRef.current.chart.destroy();
//       }
//     };
//   }, [responseData]);






//   return (
//     <div className="app-container">
//       <h1>AI Data Analyzer</h1>

//       <form onSubmit={handleSubmit} className="form-container">
//         <div className="form-group">
//           <label htmlFor="file">Upload Excel File:</label>
//           <input
//             type="file"
//             id="file"
//             accept=".xlsx"
//             onChange={handleFileChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="query">Enter Query:</label>
//           <input
//             type="text"
//             id="query"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="e.g., What calculative data can we get from this dataset?"
//             required
//           />
//         </div>

//         <button type="submit" disabled={loading} className="submit-btn">
//           {loading ? "Processing..." : "Analyze Data"}
//         </button>
//       </form>

//       {error && <p className="error-message">{error}</p>}

//       {responseData && (
//         <div className="result-container">
//           {renderContent()}
//         </div>
//       )}

//       {responseData && (
//         <div className="result-container">
//           {/* Calculative Data */}
//           {responseData.calculative_data && (
//             <div className="calculative-data">
//               <h3>Calculative Data</h3>
//               <div className="data-grid">
//                 {Object.entries(responseData.calculative_data).map(([key, value]) => (
//                   <div key={key} className="data-item">
//                     <strong>{key.replace(/_/g, " ")}:</strong> {value}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Chart */}
// {responseData.chart && (
//   <div className="chart-wrapper">
//     <canvas ref={chartRef} width="400" height="200"></canvas>
//   </div>
// )}


//         </div>
//       )}
//     </div>
//   );
// }

// export default App;











































// frontend for version 1.0

import { useState } from "react";
import axios from "axios";
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

export default function App() {
    const [query, setQuery] = useState("");
    const [responseData, setResponseData] = useState(null);
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const uploadFile = async () => {
        if (!file) return alert("Please select a file");
        const formData = new FormData();
        formData.append("file", file);

        try {
            await axios.post("http://localhost:3000/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("File uploaded successfully!");
        } catch (error) {
            alert("Error uploading file");
            console.error(error);
        }
    };

    const fetchQuery = async () => {
        if (!query) return alert("Please enter a query");

        try {
            const { data } = await axios.post("http://localhost:3000/query", { query });
            setResponseData(data);
        } catch (error) {
            alert("Error fetching data");
            console.error(error);
        }
    };

    const renderChart = () => {
        if (!responseData?.chartData) return null;
        const { chart_type, data } = responseData.chartData;

        if (chart_type === "bar") {
            return (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.labels.map((label, i) => ({ name: label, value: data.values[i] }))}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#4CAF50" />
                    </BarChart>
                </ResponsiveContainer>
            );
        }

        if (chart_type === "pie") {
            return (
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={data.labels.map((label, i) => ({ name: label, value: data.values[i] }))} dataKey="value" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                            {data.labels.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={["#FF6384", "#36A2EB", "#FFCE56"][index % 3]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            );
        }

        if (chart_type === "line") {
            return (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.labels.map((label, i) => ({ name: label, value: data.values[i] }))}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            );
        }

        return <p className="text-red-500">No chart available</p>;
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-center">AI-Powered Data Dashboard</h1>

            {/* File Upload */}
            <div className="flex space-x-2">
                <input type="file" onChange={handleFileChange} className="border p-2" />
                <button onClick={uploadFile} className="bg-blue-500 text-white px-4 py-2">Upload</button>
            </div>

            {/* Query Input */}
            <div className="flex space-x-2">
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} className="border p-2 w-full" placeholder="Enter your query..." />
                <button onClick={fetchQuery} className="bg-green-500 text-white px-4 py-2">Ask AI</button>
            </div>

            {/* Response Display */}
            {responseData && (
                <div className="p-4 border rounded">
                    <h2 className="text-lg font-bold">Query: {responseData.query}</h2>

                    {/* Number Plate for Single-Value Results */}
                    {responseData.filteredData?.length === 1 && (
                        <div className="p-4 bg-gray-100 text-xl font-bold text-center rounded shadow-md">
                            {Object.values(responseData.filteredData[0])[1]}
                        </div>
                    )}

                    {/* Render Chart */}
                    {renderChart()}
                </div>
            )}
        </div>
    );
}



