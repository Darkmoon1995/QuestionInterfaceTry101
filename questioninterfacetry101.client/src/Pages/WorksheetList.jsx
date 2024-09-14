import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../Components/CustomButton';
import axios from 'axios';

const getToken = () => {
    return sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken');
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
            navigate(`/Grade/Subject/WorksheetList/New`);
        } else {
            navigate(`/Grade/Subject/WorksheetList/${worksheetId}`);
        }
    };

    const ColorOfButton = (SpecialNumber) => {
        if (SpecialNumber % 3 === 0) {
            return "MainButtonMenu btncolor1";
        } else if (SpecialNumber % 3 === 1) {
            return "MainButtonMenu btncolor2";
        } else {
            return "MainButtonMenu btncolor3";
        }
    };

    return (
        <div className="BigWhiteBox">
            {worksheets.length > 0 ? (
                worksheets.map((worksheet) => (
                    <CustomButton
                        key={worksheet.worksheetId}
                        value1={`ID: ${worksheet.worksheetId}`}
                        value2={`Number of Questions: ${worksheet.qus.length}`}
                        value3={worksheet.worksheetId.toString()}
                        className={ColorOfButton(worksheet.worksheetId)}
                        onClick={() => handleButtonClick(worksheet.worksheetId)}
                    />
                ))
            ) : (
                <p>No worksheets available.</p>
            )}
            <CustomButton
                className="MainButtonMenu btncolor3"
                value1="NewButton"
                value2="This is for creating New Worksheet"
                value3="contact"
                onClick={() => handleButtonClick(-1)}
            />
        </div>
    );
};

export default WorksheetList;
