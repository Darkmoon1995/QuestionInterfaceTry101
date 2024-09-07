import React, { useState } from 'react';
import axios from 'axios';
import ReactModal from 'react-modal';
import '../Css/QuestionInterface.css';
import '../Css/SimpleTextBox.css';
import '../Css/WierdDivCss.css';

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
            const worksheetData = {
                Title: {
                    Text: worksheetTitle,
                    Config: { Style: textStyle, Styledegree: textStyleDegree }
                },
                FinalMessage: {
                    Text: worksheetFinalMessage,
                    Config: { Style: finalMessageStyle, Styledegree: finalMessageStyleDegree }
                },
                WorksheetType: worksheetType,
                Qus: questions.map((q, index) => ({
                    Order: index + 1,
                    Title: {
                        Text: q.title,
                        Config: { Style: q.TitleStyle, Styledegree: q.TitleStyleDegree }
                    },
                    Settings: {
                        Number1: parseInt(q.number1, 10),
                        Number2: parseInt(q.number2, 10),
                        Operation: q.operation
                    },
                    NumberOfOptions: 4, 
                    Sct: parseInt(q.sct, 10)
                }))
            };

            console.log("Sending worksheet data to the server:", worksheetData);

            const response = await axios.post('https://localhost:7226/api/Worksheet', worksheetData);
            console.log("Response from server:", response);

            alert('Worksheet saved successfully!');
            setQuestions([]);
            setWorksheetTitle('');
            setWorksheetFinalMessage('');
            setWorksheetType('');
        } catch (error) {
            console.error('Error saving worksheet:', error);
            alert('Failed to save worksheet.');
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
        <div>
            <div className="SameHeight">
                <h3>New Worksheet</h3>
                <p>
                    <button className="custom-btn BlueButton" id="Save" onClick={handleSaveAll}>Save</button>
                </p>
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
            
            <div className="WhiteBox">
                {questions.map(question => (
                    
                    <div key={question.id} className="accordion-item">
                        <div className="QuestionBlackBoarder">
                        <div className="accordion-header">
                            <p className="p1BorderBlack">{question.id}. {question.title}</p>
                            <p>{question.number1} {question.operation} {question.number2}</p>
                                <p>SCT: {question.sct}</p>
                                    <p>Question Style: {question.TitleStyle}</p>
                                    <p>Style Degree: {question.TitleStyleDegree}</p>
                        </div>
                        <div className="accordion-actions">
                                <button className="custom-btn EditButton" onClick={() => handleEditQuestion(question.id)}>Edit</button>
                                <button className="custom-btn RemoveQuestionButton" onClick={() => removeQuestion(question.id)}>Remove</button>
                        </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <p>
                <button className="custom-btn BlueButton" id="AddQuestion" onClick={() => setIsVisible(true)}>Add Question</button>
            </p>

            <ReactModal
                isOpen={isVisible}
                onRequestClose={handleCancel}
                className="Modal"
            >
                <div className="WhiteBox">
                <div className="container">
                    <label className="TextBoxlabel" htmlFor="QuestionTitle">Question Title:</label>
                    <input
                        type="text"
                        className="TextBoxinput"
                        id="QuestionTitle"
                        value={questionTitle}
                        onChange={(e) => setQuestionTitle(e.target.value)}
                    />
                </div>

                <div className="container">
                    <label className="TextBoxlabel" htmlFor="Number1">Number 1:</label>
                    <input
                        type="number"
                        className="TextBoxinput"
                        id="Number1"
                        value={number1}
                        onChange={(e) => setNumber1(e.target.value)}
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
                        <option value="+">+</option>
                        <option value="-">-</option>
                        <option value="*">*</option>
                        <option value="/">/</option>
                    </select>
                </div>

                <div className="container">
                    <label className="TextBoxlabel" htmlFor="Number2">Number 2:</label>
                    <input
                        type="number"
                        className="TextBoxinput"
                        id="Number2"
                        value={number2}
                        onChange={(e) => setNumber2(e.target.value)}
                    />
                </div>

                <div className="container">
                    <label className="TextBoxlabel" htmlFor="SCT">SCT:</label>
                    <input
                        type="number"
                        className="TextBoxinput"
                        id="SCT"
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
                        <option value="motivational">Motivational</option>
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

                <p>
                    <button className="custom-btn BlueButton" onClick={handleAddQuestion}>Save</button>
                    <button className="custom-btn RedButton" onClick={handleCancel}>Cancel</button>
                    </p>
                </div>
            </ReactModal>
        </div>
    );
};

export default QuestionInterface;
