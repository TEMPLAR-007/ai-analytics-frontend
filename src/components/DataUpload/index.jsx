import React, { useState, useRef, useEffect } from 'react';
import '../../styles/dashboard.css';

const DataUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [existingTable, setExistingTable] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchExistingTable();
    }, []);

    const fetchExistingTable = async () => {
        try {
            const response = await fetch('https://ai-analytics-backend.onrender.com/tables');
            const data = await response.json();
            if (data && data.length > 0) {
                setExistingTable(data[0]);
            }
        } catch (error) {
            console.error('Error fetching tables:', error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            setSelectedFile(file);
        } else {
            alert('Please select an Excel file (.xlsx)');
            setSelectedFile(null);
            e.target.value = null;
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || existingTable) return;

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await fetch('https://ai-analytics-backend.onrender.com/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            await fetchExistingTable();
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = null;
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload file. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async () => {
        if (!existingTable) return;

        try {
            const response = await fetch(`https://ai-analytics-backend.onrender.com/table/${existingTable.table_name}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Delete failed');
            }

            setExistingTable(null);
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete table. Please try again.');
        }
    };

    return (
        <div className="file-upload-container">
            {existingTable ? (
                <div className="existing-table-info">
                    <div className="table-info">
                        <span className="table-name">{existingTable.original_file_name}</span>
                        <span className="table-date">
                            {new Date(existingTable.upload_date).toLocaleDateString()}
                        </span>
                    </div>
                    <button
                        className="delete-button"
                        onClick={handleDelete}
                    >
                        Delete Table
                    </button>
                </div>
            ) : (
                <div className="file-input-wrapper">
                    <input
                        type="file"
                        id="fileInput"
                        className="file-input"
                        accept=".xlsx"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        disabled={isUploading}
                    />
                    <label htmlFor="fileInput" className="file-input-label">
                        {selectedFile ? selectedFile.name : 'Choose Excel File'}
                    </label>
                    <button
                        className="upload-button"
                        onClick={handleUpload}
                        disabled={!selectedFile || isUploading}
                    >
                        {isUploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default DataUpload;