import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactModal from 'react-modal';
import { Edit2, Trash2, Plus, Save, X } from 'lucide-react';

const getToken = () => {
    return sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken');
};

const getUserEmail = () => {
    return sessionStorage.getItem('userEmail') || localStorage.getItem('userEmail');
};

const WorksheetDetails = () => {
    const { worksheetId } = useParams();
    const navigate = useNavigate();
    const [worksheet, setWorksheet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [number1, setNumber1] = useState('');
    const [number2, setNumber2] = useState('');
    const [sct, setSct] = useState('');
    const [operation, setOperation] = useState('+');
    const [degree, setDegree] = useState('1');
    const [editingQuestion, setEditingQuestion] = useState(null);

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

    useEffect(() => {
        const fetchWorksheet = async () => {
            try {
                const token = getToken();
                const response = await axios.get(`https://localhost:7226/api/Worksheet/${worksheetId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = response.data;
                setWorksheet(data);
                setWorksheetTitle(data.title.text);
                setWorksheetFinalMessage(data.finalMessage.text);
                setWorksheetType(data.worksheetType);
            } catch (error) {
                console.error('Error fetching worksheet:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWorksheet();
    }, [worksheetId]);

    const handleAddQuestion = () => {
        const newQuestion = {
            order: editingQuestion !== null ? editingQuestion : worksheet.qus.length + 1,
            settings: {
                number1,
                number2,
                operation,
                degree
            },
            numberOfOptions: 4,
            sct,
            title: {
                text: questionTitle,
                config: { style: questionTitleStyle, styledegree: questionTitleStyleDegree }
            }
        };

        const updatedQuestions = editingQuestion !== null
            ? worksheet.qus.map((question) =>
                question.order === editingQuestion ? newQuestion : question
            )
            : [...worksheet.qus, newQuestion];

        setWorksheet({ ...worksheet, qus: updatedQuestions });
        clearModalState();
    };

    const handleCancel = () => {
        clearModalState();
    };

    const clearModalState = () => {
        setNumber1('');
        setNumber2('');
        setSct('');
        setOperation('+');
        setDegree('1');
        setQuestionTitle('');
        setQuestionTitleStyle('cheerful');
        setQuestionTitleStyleDegree('1');
        setEditingQuestion(null);
        setVisible(false);
    };

    const removeQuestion = (order) => {
        const updatedQuestions = worksheet.qus.filter((q) => q.order !== order);
        setWorksheet({ ...worksheet, qus: updatedQuestions });
    };

    const handleSaveAll = async () => {
        try {
            const token = getToken();
            const email = getUserEmail();
            const worksheetData = {
                ...worksheet,
                title: { text: worksheetTitle, config: { style: textStyle, styledegree: textStyleDegree } },
                finalMessage: { text: worksheetFinalMessage, config: { style: finalMessageStyle, styledegree: finalMessageStyleDegree } },
                worksheetType,
                createdBy: email, // Add user email to the payload
                qus: worksheet.qus.map((q, index) => ({
                    ...q,
                    order: index + 1,
                    settings: {
                        number1: parseInt(q.settings.number1, 10),
                        number2: parseInt(q.settings.number2, 10),
                        operation: q.settings.operation,
                        degree: q.settings.degree
                    },
                    sct: parseInt(q.sct, 10),
                    title: {
                        text: q.title.text,
                        config: { style: q.title.config.style, styledegree: q.title.config.styledegree }
                    }
                })),
            };

            const response = await axios.put(`https://localhost:7226/api/Worksheet/${worksheetId}`, worksheetData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Response from server:', response);
            alert('Worksheet saved successfully!');
        } catch (error) {
            console.error('Error saving worksheet:', error);
            alert('Failed to save worksheet.');
        }
    };

    const handleRemoveWorksheet = async () => {
        try {
            const token = getToken();
            await axios.delete(`https://localhost:7226/api/Worksheet/${worksheetId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Worksheet removed successfully!');
            navigate('/Grade');
        } catch (error) {
            console.error('Error removing worksheet:', error);
            alert('Failed to remove worksheet.');
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">Loading...</div>;
    }

    if (!worksheet) {
        return <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">Worksheet not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">Worksheet ID: {worksheetId}</h2>
                    <div>
                        <button onClick={handleSaveAll} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                            <Save className="inline-block mr-2" size={16} />
                            Save All
                        </button>
                        <button onClick={handleRemoveWorksheet} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                            <Trash2 className="inline-block mr-2" size={16} />
                            Remove All
                        </button>
                    </div>
                </div>

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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                <h3 className="text-2xl font-bold mb-4">Questions</h3>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
                    {worksheet.qus.map((question) => (
                        <div key={question.order} className="bg-gray-700 p-4 rounded-lg mb-4 flex justify-between items-center">
                            <div>
                                <p className="text-lg font-semibold mb-2">Question {question.order}</p>
                                <p>{question.settings.number1} {question.settings.operation} {question.settings.number2}</p>
                                <p>SCT: {question.sct}</p>
                                <p>Question Style: {question.title.config.style}</p>
                                <p>Style Degree: {question.settings.degree}</p>
                            </div>
                            <div>
                                <button
                                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
                                    onClick={() => {
                                        setNumber1(question.settings.number1);
                                        setNumber2(question.settings.number2);
                                        setSct(question.sct);
                                        setOperation(question.settings.operation);
                                        setDegree(question.settings.degree);
                                        setQuestionTitle(question.title.text);
                                        setQuestionTitleStyle(question.title.config.style);
                                        setQuestionTitleStyleDegree(question.title.config.styledegree);
                                        setEditingQuestion(question.order);
                                        setVisible(true);
                                    }}
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => removeQuestion(question.order)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
                    onClick={() => setVisible(true)}
                >
                    <Plus className="mr-2" size={16} />
                    Add Question
                </button>

                <ReactModal
                    isOpen={visible}
                    onRequestClose={() => setVisible(false)}
                    className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl mx-auto mt-20"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
                >
                    <h3 className="text-2xl font-bold mb-4">{editingQuestion !== null ? 'Edit Question' : 'Add New Question'}</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="QuestionTitle">Question Title:</label>
                            <input
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="text"
                                id="QuestionTitle"
                                value={questionTitle}
                                onChange={(e) => setQuestionTitle(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="Number1">Number 1:</label>
                                <input
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    type="number"
                                    id="Number1"
                                    value={number1}
                                    onChange={(e) => setNumber1(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="Number2">Number 2:</label>
                                <input
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    type="number"
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
                                <option value="+">Addition</option>
                                <option value="-">Subtraction</option>
                                <option value="/">Division</option>
                                <option value="*">Multiplication</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="Sct">Time For Question (seconds):</label>
                            <input
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="number"
                                id="Sct"
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
                                    <option value="casual">Casual</option>
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
                                onClick={handleAddQuestion}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
                            >
                                <Save className="mr-2" size={16} />
                                {editingQuestion !== null ? 'Save' : 'Add'}
                            </button>
                            <button
                                onClick={handleCancel}
                                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center"
                            >
                                <X className="mr-2" size={16} />
                                Cancel
                            </button>
                        </div>
                    </div>
                </ReactModal>
            </div>
        </div>
    );
};

export default WorksheetDetails;