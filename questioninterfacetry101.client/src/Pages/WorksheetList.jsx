import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../Components/CustomButton';

const WorksheetList = () => {
    const [worksheets, setWorksheets] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWorksheets = async () => {
            try {
                const response = await axios.get('https://localhost:7226/api/Worksheet');
                setWorksheets(response.data);
            } catch (error) {
                console.error('Error fetching worksheets:', error);
            }
        };

        fetchWorksheets();
    }, []);

    const handleButtonClick = (worksheetId) => {
        if (worksheetId == -1) {
            navigate(`/Grade/Subject/WorksheetList/New`);
        } else { 
            navigate(`/Grade/Subject/WorksheetList/${worksheetId}`);
        }
    };
    const ColorOfButton = (SpecialNumber) => {

        if (SpecialNumber % 3 == 0) {
            return "MainButtonMenu btncolor1"
        } else if (SpecialNumber % 3 == 1) {
            return "MainButtonMenu btncolor2"
        } else {
            return "MainButtonMenu btncolor3"
        }
    };

    return (
        <div className="BigWhiteBox">
            {worksheets.map((worksheet) => (
                <CustomButton
                    key={worksheet.worksheetId}
                    value1={`ID: ${worksheet.worksheetId}`}
                    value2={`Number of Questions: ${worksheet.qus.length}`}
                    value3={worksheet.worksheetId.toString()}
                    className={ColorOfButton(worksheet.worksheetId)}
                    onClick={handleButtonClick}
                />
            ))}
            <CustomButton className="MainButtonMenu btncolor3" value1="NewButton" value2="This is for creating New Worksheet" value3="contact" onClick={() => handleButtonClick(-1)} />
        </div>
    );
};

export default WorksheetList;
