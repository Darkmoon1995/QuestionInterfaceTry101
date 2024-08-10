import React, { useState } from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';
import '../Css/QuestionInterface.css';

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
    const [userId, setUserId] = useState('');

    const handleSaveAll = async () => {
        try {
            const worksheetData = {
                Title: {
                    Text: worksheetTitle,
                    Config: { Style: '', Styledegree: '' }
                },
                FinalMessage: {
                    Text: worksheetFinalMessage,
                    Config: { Style: '', Styledegree: '' }
                },
                WorksheetType: worksheetType,
                Qus: questions.map((q, index) => ({
                    Order: index + 1,
                    Title: { Text: '', Config: { Style: '', Styledegree: '' } },
                    Settings: {
                        Number1: parseInt(q.number1, 10),
                        Number2: parseInt(q.number2, 10),
                        Operation: q.operation
                    },
                    NumberOfOptions: 0,
                    Sct: parseInt(q.sct, 10)
                })),
                UserId: userId
            };

            await axios.post('/api/worksheets', worksheetData);
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
                <button className="QuestionInteface" id="Save" onClick={handleSaveAll}>Save</button>
                <button className="QuestionInteface" id="remove">Remove</button>
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
                <select name="Topics" className="QuestionInterfaceSelctor" id="Topic">
                    <option value={1}>Topics1</option>
                    <option value={2}>Topics2</option>
                    <option value={3}>Topics3</option>
                </select>
                <select name="Skills" className="QuestionInterfaceSelctor" id="Skills">
                    <option value={1}>SKILL1</option>
                    <option value={2}>SKILL2</option>
                    <option value={3}>SKILL3</option>
                </select>
                <select name="Type" className="QuestionInterfaceSelctor">
                    <option value={1}>TYPE</option>
                    <option value={2}>B</option>
                    <option value={3}>Other</option>
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
                            className="QuestionInteface"
                            id="RedColor"
                            onClick={() => removeQuestion(question.id)}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <button type="button" className="QuestionInteface" id="AddQuestionInterface" onClick={() => setVisible(true)}>Add Question</button>

            <ReactModal isOpen={visible} onRequestClose={() => setVisible(false)}>
                <div className="popupAddQuestion-context">
                    <label htmlFor="Number1">Number1:</label>
                    <input
                        type="text"
                        id="Number1"
                        value={number1}
                        onChange={(e) => setNumber1(e.target.value)}
                    /><br /><br />

                    <label htmlFor="Number2">Number2:</label>
                    <input
                        type="text"
                        id="Number2"
                        value={number2}
                        onChange={(e) => setNumber2(e.target.value)}
                    /><br /><br />

                    <label htmlFor="Operation">Operation:</label>
                    <select
                        id="QuestionInterfaceSelctorOperation"
                        className="QuestionInterfaceSelctor"
                        value={operation}
                        onChange={(e) => setOperation(e.target.value)}
                    >
                        <option value="+">Addition</option>
                        <option value="-">Subtraction</option>
                        <option value="/">Division</option>
                        <option value="*">Multiplication</option>
                    </select><br /><br />

                    <label htmlFor="Sct">Time For Question (seconds):</label>
                    <input
                        type="text"
                        id="Sct"
                        value={sct}
                        onChange={(e) => setSct(e.target.value)}
                    /><br /><br />

                    <button
                        onClick={handleAddQuestion}
                        id="SaveAddingNewQuestion"
                        className="QuestionInteface"
                    >
                        Add Question
                    </button>
                    <button
                        onClick={handleCancel}
                        className="QuestionInteface"
                        id="cancel"
                    >
                        Cancel
                    </button>
                </div>
            </ReactModal>
        </div>
    );
};

export default QuestionInterface;
