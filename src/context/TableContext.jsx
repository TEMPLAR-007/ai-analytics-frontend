import React, { createContext, useState, useContext } from 'react';

const TableContext = createContext();

export const TableProvider = ({ children }) => {
    const [currentTable, setCurrentTable] = useState(null);
    const [isLoadingTable, setIsLoadingTable] = useState(false);

    const updateTable = async () => {
        setIsLoadingTable(true);
        try {
            const response = await fetch('https://ai-analytics-backend.onrender.com/tables');
            const data = await response.json();
            if (data && data.length > 0) {
                setCurrentTable(data[0]);
            } else {
                setCurrentTable(null);
            }
        } catch (error) {
            console.error('Error fetching table:', error);
            setCurrentTable(null);
        } finally {
            setIsLoadingTable(false);
        }
    };

    return (
        <TableContext.Provider value={{ currentTable, isLoadingTable, updateTable }}>
            {children}
        </TableContext.Provider>
    );
};

export const useTable = () => {
    const context = useContext(TableContext);
    if (!context) {
        throw new Error('useTable must be used within a TableProvider');
    }
    return context;
};