// src/Pages/WorksheetsPage.jsx
import React, { useEffect, useState } from 'react';
import CustomButton from '../Components/CustomButton';

const WorksheetsPage = () => {
    const [worksheets, setWorksheets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorksheets = async () => {
            try {
                const response = await fetch('https://localhost:7226/api/Worksheet');
                const data = await response.json();
                setWorksheets(data);
            } catch (error) {
                console.error('Error fetching worksheets:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWorksheets();
    }, []);

    const handleButtonClick = (value3) => {
        console.log(value3);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!worksheets || worksheets.length === 0) {
        return <div>No worksheets available</div>;
    }

    return (
        <div>
            {worksheets.map((worksheet) => (
                <CustomButton
                    key={worksheet.worksheetId}
                    value1={`ID: ${worksheet.worksheetId || 'N/A'}`}
                    value2={`Number of Questions: ${worksheet.qus ? worksheet.qus.length : 0}`}
                    value3="Null"
                    onClick={handleButtonClick}
                />
            ))}
        </div>
    );
};

export default WorksheetsPage;
