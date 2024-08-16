import React, { useState } from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';
import '../Css/QuestionInterface.css';
import '../Css/SimpleTextBox.css';
import '../Css/WierdDivCss.css';


const QuestionInterface = () => {
    const [questions, setQuestions] = useState([]);
    const [number1, setNumber1] = useState('');
    const [number2, setNumber2] = useState('');
    const [sct, setSct] = useState('');
    const [operation, setOperation] = useState('+');
    const [visible, setVisible] = useState(false);
    const [worksheetTitle, setWorksheetTitle] = useState('');
    const [worksheetFinalMessage, setWorksheetFinalMessage] = useState('');
    const [worksheetType, setWorksheetType] = useState('');

    const handleSaveAll = async (
    ) => {
        try {
            const worksheetData = {
                Title: {
                    Text: worksheetTitle,
                    Config: { Style: 'a', Styledegree: 'b' }
                },
                FinalMessage: {
                    Text: worksheetFinalMessage,
                    Config: { Style: 'a', Styledegree: 'b' }
                },
                WorksheetType: worksheetType,
                Qus: questions.map((q, index) => ({
                    Order: index + 1,
                    Title: {
                        Text: q.title, 
                        Config: { Style: 'b', Styledegree: 'a' }
                    },
                    Settings: {
                        Number1: parseInt(q.number1, 10),
                        Number2: parseInt(q.number2, 10),
                        Operation: q.operation
                    },
                    NumberOfOptions: 0,
                    Sct: parseInt(q.sct, 10)
                }))
            };

            console.log("Sending worksheet data to the server:", worksheetData);

            const response = await axios.post('https://localhost:7226/api/Worksheet', worksheetData);
            console.log("Response from server:", response);

            alert('Worksheet saved successfully!');
        } catch (error) {
            console.error('Error saving worksheet:', error);
            alert('Failed to save worksheet.');
        }
    };
    
    const handleAddQuestion = () => {
        const newQuestion = {
            id: questions.length + 1,
            number1,
            number2,
            sct,
            operation
        };
        setQuestions([...questions, newQuestion]);
        setNumber1('');
        setNumber2('');
        setSct('');
        setVisible(false);
    };

    const handleCancel = () => {
        setNumber1('');
        setNumber2('');
        setSct('');
        setVisible(false);
    };

    const removeQuestion = (id) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    return (
        <div>
            <h3>WorkSheet</h3>
            <p>
                <button class="custom-btn BlueButton"  id="Save" onClick={handleSaveAll}>Save</button>
            </p>

            <form id="worksheetForm">
                <label htmlFor="Title">Title:</label>
                <input
                    type="text"
                    id="Title"
                    value={worksheetTitle}
                    onChange={(e) => setWorksheetTitle(e.target.value)}
                /><br /><br />

                <label htmlFor="FinalMessage">Final Message:</label>
                <input
                    type="text"
                    id="FinalMessage"
                    value={worksheetFinalMessage}
                    onChange={(e) => setWorksheetFinalMessage(e.target.value)}
                /><br /><br />
            </form>

            <div className="SameRow">
                <select
                    name="Topics"
                    className="QuestionInterfaceSelctor"
                    id="Topic"
                    onChange={(e) => setWorksheetType(e.target.value)}
                >
                    <option value="Topics1">Topics1</option>
                    <option value="Topics2">Topics2</option>
                    <option value="Topics3">Topics3</option>
                </select>
                <select
                    name="Skills"
                    className="QuestionInterfaceSelctor"
                    id="Skills"
                    onChange={(e) => setWorksheetType(e.target.value)}
                >
                    <option value="SKILL1">SKILL1</option>
                    <option value="SKILL2">SKILL2</option>
                    <option value="SKILL3">SKILL3</option>
                </select>
                <select
                    name="Type"
                    className="QuestionInterfaceSelctor"
                    onChange={(e) => setWorksheetType(e.target.value)}
                >
                    <option value="TYPE">TYPE</option>
                    <option value="B">B</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <br />
            <h3>Questions</h3>
            <hr />

            <div id="MainQuestionDivName">
                {questions.map(question => (
                    <div key={question.id} className="number-box">
                        <p className="p1BoarderBlack">{question.id}</p>
                        <p className="p1BoarderBlack">{question.number1} {question.operation} {question.number2}</p>
                        <p className="p1BoarderBlack">In {question.sct} Seconds</p>
                        <img
                            src="/gif/icons8-settings.gif"
                            id="SmallerImage"
                            alt="Edit"
                            onClick={() => {
                                setNumber1(question.number1);
                                setNumber2(question.number2);
                                setSct(question.sct);
                                setOperation(question.operation);
                                setVisible(true);
                            }}
                        />
                        <button
                            class="custom-btn RedButton"
                            id="RedColor"
                            onClick={() => removeQuestion(question.id)}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <button type="button" class="custom-btn GreenButton" id="AddQuestionInterface" onClick={() => setVisible(true)}>Add Question</button>

            <ReactModal style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                width: '100vw',
            }} className="PopUpReactModelName" isOpen={visible} onRequestClose={() => setVisible(false)} ariaHideApp={false}>
                <div class='modal-container'>
                    <div class='modal'>
                    <div className="container">
                        <label className="TextBoxlabel" htmlFor="Number1">Number1:</label>
                        <input
                            className="TextBoxinput"
                            type="text"
                            id="Number1"
                            value={number1}
                            onChange={(e) => setNumber1(e.target.value)}
                        /></div >
                    <div className="container">
                    <label className="TextBoxlabel" htmlFor="Number2">Number2:</label>
                    <input
                        className="TextBoxinput"
                        type="text"
                        id="Number2"
                        value={number2}
                        onChange={(e) => setNumber2(e.target.value)}
                            /></div >
                        <div className="container">
                    <label className="TextBoxlabel" htmlFor="Operation">Operation:</label>
                    <select
                            className="TextBoxSelect"

                        value={operation}
                        onChange={(e) => setOperation(e.target.value)}
                    >
                        <option value="+">Addition</option>
                        <option value="-">Subtraction</option>
                        <option value="/">Division</option>
                        <option value="*">Multiplication</option>
                    </select>
                        </div>
                        <label className="TextBoxlabel" htmlFor="Sct">Time For Question (seconds):</label>
                        <input
                            className="TextBoxinput"
                        type="text"
                        id="Sct"
                        value={sct}
                        onChange={(e) => setSct(e.target.value)}
                    />

                    <button
                        onClick={handleAddQuestion}
                        id="SaveAddingNewQuestion"
                            class="custom-btn GreenButton"
                    >
                        Add
                    </button>
                    <button
                        onClick={handleCancel}
                            class="custom-btn BlueButton"
                        id="cancel"
                    >
                        Cancel
                        </button>
                    </div>
                </div>
            </ReactModal>
        </div>
    );
};

export default QuestionInterface;
