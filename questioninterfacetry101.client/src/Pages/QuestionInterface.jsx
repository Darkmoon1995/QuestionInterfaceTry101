import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';

const getToken = () => {
    return sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken');
};
const getUserEmail = () => {
    return sessionStorage.getItem('userEmail') || localStorage.getItem('userEmail');
};

const QuestionInterface = () => {
    const [questions, setQuestions] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [currentQuestionId, setCurrentQuestionId] = useState(null);
    const [number1, setNumber1] = useState('');
    const [number2, setNumber2] = useState('');
    const [sct, setSct] = useState('');
    const [operation, setOperation] = useState('+');
    const [isVisible, setIsVisible] = useState(false);
    const [worksheetTitle, setWorksheetTitle] = useState('');
    const [worksheetFinalMessage, setWorksheetFinalMessage] = useState('');
    const [worksheetType, setWorksheetType] = useState('');
    const [textStyle, setTextStyle] = useState('friendly');
    const [textStyleDegree, setTextStyleDegree] = useState('1');
    const [finalMessageStyle, setFinalMessageStyle] = useState('excited');
    const [finalMessageStyleDegree, setFinalMessageStyleDegree] = useState('2');
    const [questionTitle, setQuestionTitle] = useState('');
    const [questionTitleStyle, setQuestionTitleStyle] = useState('cheerful');
    const [questionTitleStyleDegree, setQuestionTitleStyleDegree] = useState('1');

    const handleSaveAll = async () => {
        try {
            // Retrieve JWT token and user email from session or local storage
            const token = getToken();
            const email = getUserEmail();
            const worksheetType = 'worksheetType';
            // Validation: Check if token and email exist
            if (!token) {
                console.error('No JWT token found.');
                alert('Please log in first.');
                return;
            }
            if (!email) {
                console.error('No user email found.');
                alert('User email is missing.');
                return;
            }

            // Construct the worksheet data payload
            const worksheetData = {
                CreatedBy: email, // Ensure this is a valid email
                Title: {
                    Text: worksheetTitle,
                    Config: { Style: textStyle, Styledegree: textStyleDegree }
                },
                FinalMessage: {
                    Text: worksheetFinalMessage,
                    Config: { Style: finalMessageStyle, Styledegree: finalMessageStyleDegree }
                },
                WorksheetType: worksheetType, //It is not okay To be not Thing
                Qus: questions.map((q, index) => ({
                    Order: index + 1,
                    Title: {
                        Text: q.title,
                        Config: { Style: q.TitleStyle, Styledegree: q.TitleStyleDegree }
                    },
                    Settings: {
                        Number1: isNaN(parseInt(q.number1, 10)) ? 0 : parseInt(q.number1, 10),
                        Number2: isNaN(parseInt(q.number2, 10)) ? 0 : parseInt(q.number2, 10),
                        Operation: q.operation
                    },
                    NumberOfOptions: 4,
                    Sct: isNaN(parseInt(q.sct, 10)) ? 0 : parseInt(q.sct, 10)
                }))
            };

            // Log the worksheet data for debugging
            console.log("Sending worksheet data to the server:", JSON.stringify(worksheetData, null, 2));

            // Make the POST request to the API
            const response = await fetch('https://localhost:7226/api/Worksheet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(worksheetData),
            });

            // Check if the response is OK
            if (!response.ok) {
                // Log and parse the response for debugging purposes
                const responseData = await response.json();
                console.error('Server response error:', responseData);
                throw new Error(`HTTP error! status: ${response.status}, response: ${JSON.stringify(responseData)}`);
            }

            // If everything is fine, parse the response
            const data = await response.json();
            console.log("Response from server:", data);

            // Notify the user and reset form after success
            alert('Worksheet saved successfully!');
            setQuestions([]);
            setWorksheetTitle('');
            setWorksheetFinalMessage('');
            setWorksheetType('');
        } catch (error) {
            // Handle any errors encountered during the request
            console.error('Error saving worksheet:', error);
            alert('Failed to save worksheet. Please check your inputs or try again later.');
        }
    };


    const handleAddQuestion = () => {
        if (editMode) {
            setQuestions(questions.map(q =>
                q.id === currentQuestionId
                    ? {
                        ...q,
                        number1,
                        number2,
                        sct,
                        operation,
                        title: questionTitle,
                        TitleStyle: questionTitleStyle,
                        TitleStyleDegree: questionTitleStyleDegree
                    }
                    : q
            ));
        } else {
            const newQuestion = {
                id: questions.length + 1,
                number1,
                number2,
                sct,
                operation,
                title: questionTitle,
                TitleStyle: questionTitleStyle,
                TitleStyleDegree: questionTitleStyleDegree
            };
            setQuestions([...questions, newQuestion]);
        }
        setEditMode(false);
        setCurrentQuestionId(null);
        setNumber1('');
        setNumber2('');
        setSct('');
        setQuestionTitle('');
        setIsVisible(false);
    };

    const handleCancel = () => {
        setEditMode(false);
        setCurrentQuestionId(null);
        setNumber1('');
        setNumber2('');
        setSct('');
        setQuestionTitle('');
        setIsVisible(false);
    };

    const handleEditQuestion = (id) => {
        const question = questions.find(q => q.id === id);
        if (question) {
            setEditMode(true);
            setCurrentQuestionId(id);
            setNumber1(question.number1);
            setNumber2(question.number2);
            setSct(question.sct);
            setOperation(question.operation);
            setQuestionTitle(question.title);
            setQuestionTitleStyle(question.TitleStyle);
            setQuestionTitleStyleDegree(question.TitleStyleDegree);
            setIsVisible(true);
        }
    };

    const removeQuestion = (id) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">New Worksheet</h2>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="Title">Title:</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="Title"
                                value={worksheetTitle}
                                onChange={(e) => setWorksheetTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="FinalMessage">Final Message:</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="FinalMessage"
                                value={worksheetFinalMessage}
                                onChange={(e) => setWorksheetFinalMessage(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="WorksheetType">Worksheet Type:</label>
                            <select
                                name="WorksheetType"
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="WorksheetType"
                                value={worksheetType}
                                onChange={(e) => setWorksheetType(e.target.value)}
                            >
                                <option value="Topics1">Topics1</option>
                                <option value="Topics2">Topics2</option>
                                <option value="Topics3">Topics3</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="TextStyle">Text Style:</label>
                            <select
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="TextStyle"
                                value={textStyle}
                                onChange={(e) => setTextStyle(e.target.value)}
                            >
                                <option value="friendly">Friendly</option>
                                <option value="formal">Formal</option>
                                <option value="excited">Excited</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="TextStyleDegree">Style Degree:</label>
                            <select
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="TextStyleDegree"
                                value={textStyleDegree}
                                onChange={(e) => setTextStyleDegree(e.target.value)}
                            >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="FinalMessageStyle">Final Message Style:</label>
                            <select
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="FinalMessageStyle"
                                value={finalMessageStyle}
                                onChange={(e) => setFinalMessageStyle(e.target.value)}
                            >
                                <option value="excited">Excited</option>
                                <option value="motivational">Motivational</option>
                                <option value="calm">Calm</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="FinalMessageStyleDegree">Style Degree:</label>
                            <select
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="FinalMessageStyleDegree"
                                value={finalMessageStyleDegree}
                                onChange={(e) => setFinalMessageStyleDegree(e.target.value)}
                            >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                        </div>
                    </div>
                    <button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={handleSaveAll}
                    >
                        Save Worksheet
                    </button>
                </div>

                <h3 className="text-2xl font-bold mb-4">Questions</h3>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
                    {questions.map(question => (
                        <div key={question.id} className="bg-gray-700 p-4 rounded-lg mb-4 flex justify-between items-center">
                            <div>
                                <h4 className="text-lg font-semibold mb-2">{question.id}. {question.title}</h4>
                                <p className="text-gray-300">{question.number1} {question.operation} {question.number2}</p>
                                <p className="text-gray-300">SCT: {question.sct}</p>
                                <p className="text-gray-300">Question Style: {question.TitleStyle}</p>
                                <p className="text-gray-300">Style Degree: {question.TitleStyleDegree}</p>
                            </div>
                            <div>
                                <button
                                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
                                    onClick={() => handleEditQuestion(question.id)}
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => removeQuestion(question.id)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
                    onClick={() => setIsVisible(true)}
                >
                    <PlusCircle size={20} className="mr-2" />
                    Add Question
                </button>

                <ReactModal
                    isOpen={isVisible}
                    onRequestClose={handleCancel}
                    className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl mx-auto mt-20"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
                >
                    <h3 className="text-2xl font-bold mb-4">{editMode ? 'Edit Question' : 'Add Question'}</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="QuestionTitle">Question Title:</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="QuestionTitle"
                                value={questionTitle}
                                onChange={(e) => setQuestionTitle(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="Number1">Number 1:</label>
                                <input
                                    type="number"
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    id="Number1"
                                    value={number1}
                                    onChange={(e) => setNumber1(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="Number2">Number 2:</label>
                                <input
                                    type="number"
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    id="Number2"
                                    value={number2}
                                    onChange={(e) => setNumber2(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="Operation">Operation:</label>
                            <select
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="Operation"
                                value={operation}
                                onChange={(e) => setOperation(e.target.value)}
                            >
                                <option value="+">+</option>
                                <option value="-">-</option>
                                <option value="*">*</option>
                                <option value="/">/</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="SCT">SCT:</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="SCT"
                                value={sct}
                                onChange={(e) => setSct(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="QuestionTitleStyle">Question Title Style:</label>
                                <select
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    id="QuestionTitleStyle"
                                    value={questionTitleStyle}
                                    onChange={(e) => setQuestionTitleStyle(e.target.value)}
                                >
                                    <option value="cheerful">Cheerful</option>
                                    <option value="serious">Serious</option>
                                    <option value="motivational">Motivational</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="QuestionTitleStyleDegree">Style Degree:</label>
                                <select
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    id="QuestionTitleStyleDegree"
                                    value={questionTitleStyleDegree}
                                    onChange={(e) => setQuestionTitleStyleDegree(e.target.value)}
                                >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={handleAddQuestion}
                            >
                                {editMode ? 'Update' : 'Add'}
                            </button>
                            <button
                                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </ReactModal>
            </div>
        </div>
    );
};

export default QuestionInterface;