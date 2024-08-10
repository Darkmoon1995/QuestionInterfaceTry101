import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../Components/CustomButton.jsx';

function Home() {
    const navigate = useNavigate();

    const handleButtonClick = (path) => {
        let url = '';

        if (path === 'contact') {
            url = '/Grade/subject';
        } else if (path === 'Helloworld.com') {
            url = 'https://Helloworld.com';
        } else {
            url = `/${path}`;
        }

        navigate(url);
    };

    return (
        <div className="button-container">
            <CustomButton value1="Grade1" value2="Math, science..." value3="contact" onClick={handleButtonClick} />
            <CustomButton value1="Grade2" value2="Math, science..." value3="contact" onClick={handleButtonClick} />
            <CustomButton value1="Grade3" value2="Math, science..." value3="contact" onClick={handleButtonClick} />
        </div>
    );
}

export default Home;
