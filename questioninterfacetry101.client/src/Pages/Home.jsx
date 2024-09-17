import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Book, Beaker } from 'lucide-react';

const CustomButton = ({ className, value1, value2, value3, onClick }) => {
    return (
        <button
            className={`w-full p-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${className}`}
            onClick={() => onClick(value3)}
        >
            <div className="text-2xl font-bold mb-2">{value1}</div>
            <div className="text-sm mb-2">{value2}</div>
            <div className="text-xs opacity-70">{value3}</div>
        </button>
    );
};

function Home() {
    const navigate = useNavigate();

    const handleButtonClick = (path) => {
        let url = '';

        if (path === 'contact') {
            url = '/subject';
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
                        value1={
                            <div className="flex items-center justify-center">
                                <GraduationCap className="mr-2" />
                                Grade 1
                            </div>
                        }
                        value2="Math, science..."
                        value3="contact"
                        onClick={handleButtonClick}
                    />
                    <CustomButton
                        className="bg-green-600 hover:bg-green-700 text-white focus:ring-green-500"
                        value1={
                            <div className="flex items-center justify-center">
                                <Book className="mr-2" />
                                Grade 2
                            </div>
                        }
                        value2="Math, science..."
                        value3="contact"
                        onClick={handleButtonClick}
                    />
                    <CustomButton
                        className="bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500"
                        value1={
                            <div className="flex items-center justify-center">
                                <Beaker className="mr-2" />
                                Grade 3
                            </div>
                        }
                        value2="Math, science..."
                        value3="contact"
                        onClick={handleButtonClick}
                    />
                </div>
            </div>
        </div>
    );
}

export default Home;