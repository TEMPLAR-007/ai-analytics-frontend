const API_BASE_URL = 'https://ai-analytics-backend.onrender.com'; // Update this to match your backend URL

export const fetchQueryData = async (query) => {
    try {
        const response = await fetch(`${API_BASE_URL}/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to fetch data');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        if (error.message === 'Failed to fetch') {
            throw new Error('Unable to connect to the server. Please make sure the backend server is running.');
        }
        throw error;
    }
};

export const fetchTableInsights = async (tableName) => {
    try {
        const response = await fetch(`${API_BASE_URL}/table-insights/${tableName}`);
        if (!response.ok) {
            throw new Error('Failed to fetch table insights');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching table insights:', error);
        throw error;
    }
};