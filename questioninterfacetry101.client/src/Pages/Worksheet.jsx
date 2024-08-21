import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactModal from 'react-modal';
import '../Css/QuestionInterface.css';
import '../Css/SimpleTextBox.css';
import '../Css/WierdDivCss.css';

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
                const response = await axios.get(`https://localhost:7226/api/Worksheet/${worksheetId}`);
                setWorksheet(response.data);
                setWorksheetTitle(response.data.title.text);
                setWorksheetFinalMessage(response.data.finalMessage.text);
                setWorksheetType(response.data.worksheetType);
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
        setWorksheet({
            ...worksheet,
            qus: worksheet.qus.filter((q) => q.order !== order),
        });
    };

    const handleSaveAll = async () => {
        try {
            const worksheetData = {
                ...worksheet,
                title: { text: worksheetTitle, config: { style: textStyle, styledegree: textStyleDegree } },
                finalMessage: { text: worksheetFinalMessage, config: { style: finalMessageStyle, styledegree: finalMessageStyleDegree } },
                worksheetType,
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

            const response = await axios.put(`https://localhost:7226/api/Worksheet/${worksheetId}`, worksheetData);
            console.log('Response from server:', response);
            alert('Worksheet saved successfully!');
        } catch (error) {
            console.error('Error saving worksheet:', error);
            alert('Failed to save worksheet.');
        }
    };

    const handleRemoveWorksheet = async () => {
        try {
            await axios.delete(`https://localhost:7226/api/Worksheet/${worksheetId}`);
            alert('Worksheet removed successfully!');
            navigate('/Grade');
        } catch (error) {
            console.error('Error removing worksheet:', error);
            alert('Failed to remove worksheet.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!worksheet) {
        return <div>Worksheet not found</div>;
    }

    return (
        <div>
            <div className="SameHeight">
                <h1> Worksheet ID : {worksheetId}</h1>
            <div className="container">
                <label className="TextBoxlabel" htmlFor="Title">Title:</label>
                <input
                    type="text"
                    className="TextBoxinput"
                    id="Title"
                    value={worksheetTitle}
                    onChange={(e) => setWorksheetTitle(e.target.value)}
                />
            </div>
            <div className="container">
                <label className="TextBoxlabel" htmlFor="FinalMessage">Final Message:</label>
                <input
                    type="text"
                    className="TextBoxinput"
                    id="FinalMessage"
                    value={worksheetFinalMessage}
                    onChange={(e) => setWorksheetFinalMessage(e.target.value)}
                />
                </div>

            <div className="container">
                <label className="TextBoxlabel" htmlFor="WorksheetType">Worksheet Type:</label>
                <select
                    name="WorksheetType"
                    className="TextBoxSelect"
                    id="WorksheetType"
                    value={worksheetType}
                    onChange={(e) => setWorksheetType(e.target.value)}
                >
                    <option value="Topics1">Topics1</option>
                    <option value="Topics2">Topics2</option>
                    <option value="Topics3">Topics3</option>
                </select>
            </div>

            <div className="container">
                <label className="TextBoxlabel" htmlFor="TextStyle">Text Style:</label>
                <select
                    className="TextBoxSelect"
                    id="TextStyle"
                    value={textStyle}
                    onChange={(e) => setTextStyle(e.target.value)}
                >
                    <option value="friendly">Friendly</option>
                    <option value="formal">Formal</option>
                    <option value="excited">Excited</option>
                </select>

                <label className="TextBoxlabel" htmlFor="TextStyleDegree">Style Degree:</label>
                <select
                    className="TextBoxSelect"
                    id="TextStyleDegree"
                    value={textStyleDegree}
                    onChange={(e) => setTextStyleDegree(e.target.value)}
                >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
            </div>

            <div className="container">
                <label className="TextBoxlabel" htmlFor="FinalMessageStyle">Final Message Style:</label>
                <select
                    className="TextBoxSelect"
                    id="FinalMessageStyle"
                    value={finalMessageStyle}
                    onChange={(e) => setFinalMessageStyle(e.target.value)}
                >
                    <option value="excited">Excited</option>
                    <option value="motivational">Motivational</option>
                    <option value="calm">Calm</option>
                </select>

                <label className="TextBoxlabel" htmlFor="FinalMessageStyleDegree">Style Degree:</label>
                <select
                    className="TextBoxSelect"
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
            <br />
            <h3>Questions</h3>
            <hr />

            <div id="MainQuestionDivName">
                {worksheet.qus.map((question) => (
                    <div key={question.order} className="number-box">
                        <p className="p1BorderBlack">{question.order}</p>
                        <p className="p1BorderBlack">{question.settings.number1} {question.settings.operation} {question.settings.number2}</p>
                        <p className="p1BorderBlack">Degree: {question.settings.degree}</p>
                        <p className="p1BorderBlack">In {question.sct} Seconds</p>
                        <img
                            src="/gif/icons8-settings.gif"
                            id="SmallerImage"
                            alt="Edit"
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
                        />
                        <button
                            className="custom-btn RedButton"
                            id="RedColor"
                            onClick={() => removeQuestion(question.order)}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <button type="button" className="custom-btn GreenButton" id="AddQuestionInterface" onClick={() => setVisible(true)}>Add Question</button>
            <button type="button" className="custom-btn BlueButton" onClick={handleSaveAll}>Save</button>
            <button type="button" className="custom-btn RedButton" onClick={handleRemoveWorksheet}>Remove Worksheet</button>

            <ReactModal
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    width: '100vw',
                }}
                className="PopUpReactModelName"
                isOpen={visible}
                onRequestClose={() => setVisible(false)}
                ariaHideApp={false}
            >

                <div id="MainQuestionDivName" className="WhiteBox">
                    <div className="insidePopUp">
                        <h3 className="InsidePopUpH3">{editingQuestion !== null ? 'Edit Question' : 'Add New Question'}</h3>

                        <div className="container">
                            <label className="TextBoxlabel" htmlFor="QuestionTitle">Question Title:</label>
                            <input
                                className="TextBoxinput"
                                type="text"
                                id="QuestionTitle"
                                value={questionTitle}
                                onChange={(e) => setQuestionTitle(e.target.value)}
                            />
                        </div>

                        <div className="container">
                            <label className="TextBoxlabel" htmlFor="Number1">Number1:</label>
                            <input
                                className="TextBoxinput"
                                type="number"
                                id="Number1"
                                value={number1}
                                onChange={(e) => setNumber1(e.target.value)}
                            />
                        </div>

                        <div className="container">
                            <label className="TextBoxlabel" htmlFor="Number2">Number2:</label>
                            <input
                                className="TextBoxinput"
                                type="number"
                                id="Number2"
                                value={number2}
                                onChange={(e) => setNumber2(e.target.value)}
                            />
                        </div>

                        <div className="container">
                            <label className="TextBoxlabel" htmlFor="Operation">Operation:</label>
                            <select
                                className="TextBoxSelect"
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

                        <div className="container">
                            <label className="TextBoxlabel" htmlFor="Degree">Degree:</label>
                            <select
                                className="TextBoxSelect"
                                id="Degree"
                                value={degree}
                                onChange={(e) => setDegree(e.target.value)}
                            >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                        </div>

                        <div className="container">
                            <label className="TextBoxlabel" htmlFor="Sct">Time For Question (seconds):</label>
                            <input
                                className="TextBoxinput"
                                type="number"
                                id="Sct"
                                value={sct}
                                onChange={(e) => setSct(e.target.value)}
                            />
                        </div>

                        <div className="container">
                            <label className="TextBoxlabel" htmlFor="QuestionTitleStyle">Question Title Style:</label>
                            <select
                                className="TextBoxSelect"
                                id="QuestionTitleStyle"
                                value={questionTitleStyle}
                                onChange={(e) => setQuestionTitleStyle(e.target.value)}
                            >
                                <option value="cheerful">Cheerful</option>
                                <option value="serious">Serious</option>
                                <option value="casual">Casual</option>
                            </select>

                            <label className="TextBoxlabel" htmlFor="QuestionTitleStyleDegree">Style Degree:</label>
                            <select
                                className="TextBoxSelect"
                                id="QuestionTitleStyleDegree"
                                value={questionTitleStyleDegree}
                                onChange={(e) => setQuestionTitleStyleDegree(e.target.value)}
                            >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                        </div>

                        <div className="button-container">
                            <button
                                onClick={handleAddQuestion}
                                className="custom-btn GreenButton"
                                id="SaveAddingNewQuestion"
                            >
                                {editingQuestion !== null ? 'Save Changes' : 'Add'}
                            </button>
                            <button
                                onClick={handleCancel}
                                className="custom-btn BlueButton"
                                id="cancel"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </ReactModal>

        </div>
    );
};

export default WorksheetDetails;
