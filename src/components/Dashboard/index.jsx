import React, { useState, useEffect } from 'react';
import DataUpload from '../DataUpload';
import ChartUtils from '../ChartUtils';
import { fetchQueryData } from '../../services/api';
import '../../styles/dashboard.css';

const Dashboard = () => {
    const [query, setQuery] = useState('');
    const [dashboardItems, setDashboardItems] = useState([]);
    const [isQuerying, setIsQuerying] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const transformChartData = (chartData) => {
        // Define a color palette for chart items
        const colorPalette = [
            'rgba(99, 102, 241, 0.5)',  // Indigo
            'rgba(16, 185, 129, 0.5)',  // Green
            'rgba(245, 158, 11, 0.5)',  // Yellow
            'rgba(239, 68, 68, 0.5)',   // Red
            'rgba(139, 92, 246, 0.5)',  // Purple
            'rgba(59, 130, 246, 0.5)',  // Blue
            'rgba(236, 72, 153, 0.5)',  // Pink
            'rgba(20, 184, 166, 0.5)',  // Teal
            'rgba(234, 179, 8, 0.5)',   // Amber
            'rgba(168, 85, 247, 0.5)'   // Violet
        ];

        const borderColorPalette = [
            'rgb(99, 102, 241)',    // Indigo
            'rgb(16, 185, 129)',    // Green
            'rgb(245, 158, 11)',    // Yellow
            'rgb(239, 68, 68)',     // Red
            'rgb(139, 92, 246)',    // Purple
            'rgb(59, 130, 246)',    // Blue
            'rgb(236, 72, 153)',    // Pink
            'rgb(20, 184, 166)',    // Teal
            'rgb(234, 179, 8)',     // Amber
            'rgb(168, 85, 247)'     // Violet
        ];

        return {
            labels: chartData.data.labels,
            datasets: [{
                label: chartData.config.yAxisLabel || 'Value',
                data: chartData.data.values,
                backgroundColor: colorPalette.slice(0, chartData.data.labels.length),
                borderColor: borderColorPalette.slice(0, chartData.data.labels.length),
                borderWidth: 1
            }]
        };
    };

    const handleQuerySubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsQuerying(true);

        try {
            const apiResponse = await fetchQueryData(query.trim());

            const newItem = {
                title: apiResponse.chartData.config.title,
                query: query.trim(),
                sql: apiResponse.sql,
                chartType: apiResponse.chartData.chart_type,
                data: transformChartData(apiResponse.chartData),
                filteredData: apiResponse.filteredData
            };

            setDashboardItems(prev => [...prev, newItem]);
        } catch (error) {
            console.error('Query error:', error);
            // You might want to show an error message to the user here
        } finally {
            setIsQuerying(false);
            setQuery('');
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="header-content">
                    <div className="header-left">
                        <h1 className="header-title">AI SQL Analytics</h1>
                        <p className="header-subtitle">Query your data with natural language</p>
                    </div>
                    <div className="header-right">
                        <button
                            className="theme-toggle"
                            onClick={() => setIsDarkMode(!isDarkMode)}
                        >
                            {isDarkMode ? '☀️' : '🌙'}
                        </button>
                        <DataUpload />
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="query-section">
                    <form className="query-form" onSubmit={handleQuerySubmit}>
                        <input
                            type="text"
                            className="query-input"
                            placeholder="Ask a question about your data..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            disabled={isQuerying}
                        />
                        <button
                            type="submit"
                            className={`query-button ${isQuerying ? 'loading' : ''}`}
                            disabled={isQuerying || !query.trim()}
                        >
                            {isQuerying ? (
                                <>
                                    <span className="spinner"></span>
                                    Processing...
                                </>
                            ) : (
                                'Run Query'
                            )}
                        </button>
                    </form>
                    {!query.trim() && !isQuerying && (
                        <div className="example-queries">
                            <p className="example-queries-title">Example queries:</p>
                            <ul className="example-queries-list">
                                <li onClick={() => setQuery("What are the top 5 selling items?")}>"What are the top 5 selling items?"</li>
                                <li onClick={() => setQuery("Compare sales between different categories")}>"Compare sales between different categories"</li>
                                <li onClick={() => setQuery("What is the average price of products?")}>"What is the average price of products?"</li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* Main dashboard content */}
                <div className="dashboard-grid">
                    {dashboardItems.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📊</div>
                            <h2 className="empty-state-title">No queries yet</h2>
                            <p className="empty-state-text">
                                Upload data and ask questions to get insights
                            </p>
                        </div>
                    ) : (
                        dashboardItems.map((item, index) => (
                            <div key={index} className="dashboard-card">
                                <div className="card-header">
                                    <h3 className="card-title">{item.query}</h3>
                                    <div className="card-actions">
                                        {!(item.filteredData.length === 1 && Object.keys(item.filteredData[0]).length === 1) && (
                                            <div className="chart-type-selector">
                                                <select
                                                    value={item.chartType}
                                                    onChange={(e) => {
                                                        const newItems = [...dashboardItems];
                                                        newItems[index] = {
                                                            ...item,
                                                            chartType: e.target.value
                                                        };
                                                        setDashboardItems(newItems);
                                                    }}
                                                >
                                                    <option value="bar">Bar Chart</option>
                                                    <option value="line">Line Chart</option>
                                                    <option value="pie">Pie Chart</option>
                                                </select>
                                            </div>
                                        )}
                                        <button
                                            className="delete-card-button"
                                            onClick={() => {
                                                setDashboardItems(prev => prev.filter((_, i) => i !== index));
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                                <div className="card-content">
                                    {item.filteredData.length === 1 && Object.keys(item.filteredData[0]).length === 1 ? (
                                        // Show calculation result without chart
                                        <div className="calculation-result">
                                            <div className="result-label">
                                                {Object.keys(item.filteredData[0])[0].replace(/_/g, ' ').toUpperCase()}
                                            </div>
                                            <div className="result-value">
                                                {Object.keys(item.filteredData[0])[0] === 'count'
                                                    ? Object.values(item.filteredData[0])[0]
                                                    : Object.keys(item.filteredData[0])[0].includes('sales')
                                                        ? `$${parseFloat(Object.values(item.filteredData[0])[0]).toLocaleString()}`
                                                        : Object.values(item.filteredData[0])[0]
                                                }
                                            </div>
                                        </div>
                                    ) : (
                                        // Show chart for multiple data points
                                        <div className="chart-container">
                                            <ChartUtils
                                                type={item.chartType}
                                                data={item.data}
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: false,
                                                    plugins: {
                                                        legend: {
                                                            position: 'top',
                                                        },
                                                        title: {
                                                            display: false
                                                        }
                                                    },
                                                    scales: {
                                                        y: {
                                                            beginAtZero: true,
                                                            title: {
                                                                display: true,
                                                                text: item.data.datasets[0].label
                                                            }
                                                        },
                                                        x: {
                                                            title: {
                                                                display: true,
                                                                text: 'Item'
                                                            }
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                    {/* Display filtered data in a table */}
                                    <div className="data-table-container">
                                        <table className="data-table">
                                            <thead>
                                                <tr>
                                                    {item.filteredData[0] && Object.keys(item.filteredData[0]).map((header) => (
                                                        <th key={header}>
                                                            {header.replace(/_/g, ' ').toUpperCase()}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {item.filteredData.map((row, idx) => (
                                                    <tr key={idx}>
                                                        {Object.entries(row).map(([key, value]) => (
                                                            <td key={key}>
                                                                {key === 'count'
                                                                    ? value
                                                                    : key.includes('sales')
                                                                        ? `$${parseFloat(value).toLocaleString()}`
                                                                        : value
                                                                }
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;