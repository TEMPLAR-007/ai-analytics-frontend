import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const ChartUtils = ({ type, data, options }) => {
    const renderChart = () => {
        switch (type) {
            case 'line':
                return <Line data={data} options={options} />;
            case 'bar':
                return <Bar data={data} options={options} />;
            case 'pie':
                return <Pie data={data} options={options} />;
            default:
                return <div>Unsupported chart type</div>;
        }
    };

    return renderChart();
};

export default ChartUtils;