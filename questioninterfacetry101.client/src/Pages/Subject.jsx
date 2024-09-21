import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, FlaskConical, Palette } from 'lucide-react'; // Updated icon

const CustomButton = ({ className, value1, value2, value3, onClick, icon: Icon }) => {
    return (
        <button
            className={`w-full p-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${className}`}
            onClick={() => onClick(value3)}
        >
            <Icon className="w-12 h-12 mx-auto mb-4" />
            <div className="text-2xl font-bold mb-2">{value1}</div>
            <div className="text-sm mb-2">{value2}</div>
            <div className="text-xs opacity-70">{value3}</div>
        </button>
    );
};

function Subject() {
    const navigate = useNavigate();

    const handleButtonClick = (path) => {
        let url = '';

        if (path === 'WorksheetList') {
            url = '/Subject/WorksheetList';
        } else {
            url = `/${path}`;
        }

        navigate(url);
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <CustomButton
                        className="bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500"
                        value1="Math"
                        value2="DID NOT DO IT"
                        value3="WorksheetList"
                        onClick={handleButtonClick}
                        icon={Book}
                    />
                    <CustomButton
                        className="bg-green-600 hover:bg-green-700 text-white focus:ring-green-500"
                        value1="Science"
                        value2="DID NOT DO IT"
                        value3="WorksheetList"
                        onClick={handleButtonClick}
                        icon={FlaskConical}
                    />
                    <CustomButton
                        className="bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500"
                        value1="Art"
                        value2="Have No Idea what to put"
                        value3="WorksheetList"
                        onClick={handleButtonClick}
                        icon={Palette}
                    />
                </div>
            </div>
        </div>
    );
}

export default Subject;
