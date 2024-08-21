import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../Components/CustomButton.jsx';
import '../Css/MainButtonForSubjects.css';
import '../Css/WierdDivCss.css';


function Home() {
    const navigate = useNavigate();

    const handleButtonClick = (path) => {
        let url = '';

        if (path === 'contact') {
            url = '/Grade/subject';
        } else {
            url = `/${path}`;
        }

        navigate(url);
    };

    return (
        <div className="BigWhiteBox">
            
                <CustomButton className="MainButtonMenu btncolor1" value1="Grade1" value2="Math, science..." value3="contact" onClick={handleButtonClick} />
                <CustomButton className="MainButtonMenu btncolor2" value1="Grade2" value2="Math, science..." value3="contact" onClick={handleButtonClick} />
                <CustomButton className="MainButtonMenu btncolor3" value1="Grade3" value2="Math, science..." value3="contact" onClick={handleButtonClick} />
            
        </div>
    );
}

export default Home;
