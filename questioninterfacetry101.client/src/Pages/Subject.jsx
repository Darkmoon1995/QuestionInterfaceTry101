import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../Components/CustomButton.jsx';
import '../Css/MainButtonForSubjects.css';
import '../Css/WierdDivCss.css';


function Subject() {
    const navigate = useNavigate();

    const handleButtonClick = (path) => {
        let url = '';

        if (path === 'WorksheetList') {
            url = '/Grade/Subject/WorksheetList';
        } else {
            url = `/${path}`;
        }

        navigate(url);
    };

    return (
        <div className="BigWhiteBox">

            <CustomButton className="MainButtonMenu btncolor1" value1="Math" value2="DID NOT DO IT" value3="WorksheetList" onClick={handleButtonClick} />
            <CustomButton className="MainButtonMenu btncolor2" value1="Science" value2="DID NOT DO IT" value3="WorksheetList" onClick={handleButtonClick} />
            <CustomButton className="MainButtonMenu btncolor3" value1="Art" value2="DID NOT DO IT" value3="WorksheetList" onClick={handleButtonClick} />

        </div>
    );
}

export default Subject;
