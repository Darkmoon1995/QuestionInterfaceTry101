import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const getToken = () => {
    return sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken');
};

const CustomButton = ({ value1, value2, value3, className, onClick }) => {
    return (
        <button
            className={`w-full mb-4 p-4 rounded-lg transition-colors duration-200 ${className}`}
            onClick={onClick}
        >
            <div className="text-lg font-semibold">{value1}</div>
            <div className="text-sm">{value2}</div>
            <div className="text-xs opacity-70">{value3}</div>
        </button>
    );
};

const WorksheetList = () => {
    const [worksheets, setWorksheets] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWorksheets = async () => {
            try {
                const token = getToken();

                if (!token) {
                    console.error('No JWT token found.');
                    return; // Prevent API call if no token
                }

                const response = await axios.get('https://localhost:7226/api/Worksheet', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setWorksheets(response.data);
            } catch (error) {
                console.error('Error fetching worksheets:', error);
            }
        };

        fetchWorksheets();
    }, []);

    const handleButtonClick = (worksheetId) => {
        if (worksheetId === -1) {
            navigate(`/Subject/WorksheetList/New`);
        } else {
            navigate(`/Subject/WorksheetList/${worksheetId}`);
        }
    };

    const ColorOfButton = (SpecialNumber) => {
        if (SpecialNumber % 3 === 0) {
            return "bg-blue-600 hover:bg-blue-700 text-white";
        } else if (SpecialNumber % 3 === 1) {
            return "bg-green-600 hover:bg-green-700 text-white";
        } else {
            return "bg-purple-600 hover:bg-purple-700 text-white";
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">Worksheets</h2>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    {worksheets.length > 0 ? (
                        worksheets.map((worksheet) => (
                            <CustomButton
                                key={worksheet.worksheetId}
                                value1={`Worksheet ID: ${worksheet.worksheetId}`}
                                value2={`Number of Questions: ${worksheet.qus.length}`}
                                value3={`Created: ${new Date(worksheet.createdAt).toLocaleDateString()}`}
                                className={ColorOfButton(worksheet.worksheetId)}
                                onClick={() => handleButtonClick(worksheet.worksheetId)}
                            />
                        ))
                    ) : (
                        <p className="text-gray-400 text-center py-4">No worksheets available.</p>
                    )}
                    <CustomButton
                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                        value1="Create New Worksheet"
                        value2="Click here to create a new worksheet"
                        value3="New"
                        onClick={() => handleButtonClick(-1)} // Always allow anyone to create new worksheet
                    />
                </div>
            </div>
        </div>
    );
};

export default WorksheetList;
