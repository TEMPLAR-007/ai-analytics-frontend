import React, { useState, useEffect } from 'react';
import DataUpload from '../DataUpload';
import ChartUtils from '../ChartUtils';
import { fetchQueryData } from '../../services/api';
import '../../styles/dashboard.css';

const Dashboard = () => {
    const [query, setQuery] = useState('');
    const [dashboardItems, setDashboardItems] = useState([]);
    const [isQuerying, setIsQuerying] = useState(false);
    const [currentTable, setCurrentTable] = useState(null);
    const [exampleQueriesKey, setExampleQueriesKey] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });
    const [isLoadingQueries, setIsLoadingQueries] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0); // Add this for forced refresh
    const [isExpandedSummary, setIsExpandedSummary] = useState(false);
    const [previousTable, setPreviousTable] = useState(null); // Add this to keep previous data during loading
    const [expandedCards, setExpandedCards] = useState(new Set()); // Add this for tracking expanded cards

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    // Add a new function for handling deletion
    const handleDelete = () => {
        // Immediately clear the current table and stop loading
        setCurrentTable(null);
        setIsLoadingQueries(false);
    };

    // Simple fetch for initial load - no polling
    const fetchInitialTableData = async () => {
        try {
            const response = await fetch('https://ai-analytics-backend.onrender.com/tables');
            const data = await response.json();
            if (data && data.length > 0) {
                setCurrentTable(data[0]);
            } else {
                setCurrentTable(null);
            }
        } catch (error) {
            console.error('Error fetching initial table data:', error);
            setCurrentTable(null);
        }
    };

    // Polling fetch for after upload
    const fetchTableDataWithPolling = async () => {
        let attempts = 0;
        const maxAttempts = 10;
        const pollInterval = 1000;

        const pollData = async () => {
            try {
                const response = await fetch('https://ai-analytics-backend.onrender.com/tables');
                const data = await response.json();

                if (data && data.length > 0 && data[0].example_queries) {
                    setCurrentTable(data[0]);
                    setPreviousTable(null);
                    setIsLoadingQueries(false);
                    return true;
                }

                attempts++;
                if (attempts >= maxAttempts) {
                    console.error('Failed to load data after maximum attempts');
                    setIsLoadingQueries(false);
                    return true;
                }

                await new Promise(resolve => setTimeout(resolve, pollInterval));
                return false;
            } catch (error) {
                console.error('Error fetching table:', error);
                return false;
            }
        };

        while (!(await pollData())) {
            console.log(`Polling attempt ${attempts + 1} of ${maxAttempts}`);
        }
    };

    // Initial fetch when component mounts - no polling
    useEffect(() => {
        fetchInitialTableData();
    }, []);

    // Handler for table updates
    const handleTableUpdate = async (isDelete = false) => {
        setIsLoadingQueries(true);
        if (isDelete) {
            setPreviousTable(null);
            setCurrentTable(null);
            setIsLoadingQueries(false);
        } else {
            // Store current table as previous before starting polling
            setPreviousTable(currentTable);
            await fetchTableDataWithPolling();
        }
    };

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

    // Separate Data Summary Component
    const DataSummarySection = React.memo(({ currentTable, isLoading }) => {
        if (!currentTable?.data_summary) return null;

        const summary = currentTable.data_summary.summary;
        const MAX_LENGTH = 180;

        const truncateToLastWord = (text, maxLength) => {
            if (text.length <= maxLength) return text;
            const truncated = text.substr(0, maxLength);
            const lastSpace = truncated.lastIndexOf(' ');
            return lastSpace === -1 ? truncated : truncated.substr(0, lastSpace);
        };

        const shouldTruncate = summary.length > MAX_LENGTH;
        const truncatedSummary = shouldTruncate
            ? truncateToLastWord(summary, MAX_LENGTH)
            : summary;

        return (
            <div className={`data-summary-container ${isLoading ? 'loading' : ''}`}>
                <div className="data-summary">
                    <div className="data-summary-header">
                        <p className="data-summary-title">
                            Data Overview
                            {isLoading && (
                                <span className="loading-spinner">
                                    <svg className="spinner-icon" viewBox="0 0 50 50">
                                        <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                                    </svg>
                                </span>
                            )}
                        </p>
                    </div>
                    <div className={`summary-content ${isLoading ? 'loading' : ''}`}>
                        <span className={`summary-text ${!isExpandedSummary && shouldTruncate ? 'truncated' : ''}`}>
                            {isExpandedSummary ? summary : truncatedSummary}
                            {!isExpandedSummary && shouldTruncate && (
                                <button
                                    className="read-more-inline"
                                    onClick={() => setIsExpandedSummary(true)}
                                >
                                    read more
                                </button>
                            )}
                        </span>
                        {isExpandedSummary && (
                            <button
                                className="show-less-button"
                                onClick={() => setIsExpandedSummary(false)}
                            >
                                Show less
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    });

    // Example Queries Section Component
    const ExampleQueriesSection = React.memo(({ currentTable, previousData, onQuerySelect, isLoading }) => {
        // Use previous data while loading
        const displayData = isLoading ? previousData : currentTable;

        return (
            <div className={`example-queries ${isLoading ? 'loading' : ''}`}>
                <p className="example-queries-title">
                    Example queries:
                    {isLoading && (
                        <span className="loading-spinner">
                            <svg className="spinner-icon" viewBox="0 0 50 50">
                                <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                            </svg>
                        </span>
                    )}
                </p>
                <ul className={`example-queries-list ${isLoading ? 'loading' : ''}`}>
                    {displayData?.example_queries ? (
                        displayData.example_queries.map((exampleQuery, index) => (
                            <li
                                key={index}
                                onClick={() => onQuerySelect(exampleQuery)}
                                style={{
                                    animationDelay: `${index * 0.1}s`,
                                    opacity: isLoading ? 0.5 : 1
                                }}
                            >
                                "{exampleQuery}"
                            </li>
                        ))
                    ) : (
                        <li className="no-data-message">
                            Please upload data first to see example queries
                        </li>
                    )}
                </ul>
            </div>
        );
    });

    const toggleCard = (index) => {
        setExpandedCards(prev => {
            const newSet = new Set(prev);
            if (!newSet.has(index)) {
                newSet.add(index);  // When clicking "Show", add to expanded set
            } else {
                newSet.delete(index);  // When clicking "Hide", remove from expanded set
            }
            return newSet;
        });
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
                        <DataUpload onTableUpdate={handleTableUpdate} />
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                {/* Data Summary above query section */}
                <DataSummarySection
                    currentTable={currentTable}
                    isLoading={isLoadingQueries}
                />

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
                        <ExampleQueriesSection
                            currentTable={currentTable}
                            previousData={previousTable}
                            onQuerySelect={setQuery}
                            isLoading={isLoadingQueries}
                        />
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
                            <div key={index} className={`dashboard-card ${!expandedCards.has(index) ? 'expanded' : ''}`}>
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
                                        {(item.filteredData.length > 5 ||
                                            (item.filteredData[0] && Object.keys(item.filteredData[0]).length > 4)) && (
                                                <button
                                                    className="toggle-card-button"
                                                    onClick={() => toggleCard(index)}
                                                >
                                                    {!expandedCards.has(index) ? 'Hide' : 'Show'}
                                                </button>
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
                                <div className="card-preview">
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
                                        // Show chart
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
                                </div>
                                <div className={`card-details ${item.filteredData.length <= 5 &&
                                    (!item.filteredData[0] || Object.keys(item.filteredData[0]).length <= 4) ?
                                    'expanded' :
                                    (!expandedCards.has(index) ? 'expanded' : '')
                                    }`}>
                                    {/* Display filtered data in a table */}
                                    <div className="data-table-wrapper">
                                        <div className="data-table-container">
                                            <div className="table-scroll-container">
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
                                            {/* Add scroll indicators */}
                                            <div className="scroll-indicators">
                                                <div className="scroll-indicator left"></div>
                                                <div className="scroll-indicator right"></div>
                                            </div>
                                        </div>
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