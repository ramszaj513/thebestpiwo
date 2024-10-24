import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [question, setQuestion] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    const fetchQuestion = async () => {
        try {
            const response = await axios.get('http://localhost:8080/question');
            setQuestion(response.data);
        } catch (error) {
            console.error('Error fetching question:', error);
        }
    };

    const fetchLeaderboard = async () => {
        try {
            const response = await axios.get('http://localhost:8080/leaderboard');
            setLeaderboard(response.data);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        }
    };

    const handleBeerClick = async (winnerId) => {
        if (!question) return;

        try {
            await axios.post('http://localhost:8080/answer', {
                id: question.id,
                winnerPiwoId: winnerId,
            });
            fetchQuestion(); // Fetch a new question after submitting the answer
        } catch (error) {
            console.error('Error submitting answer:', error);
        }
    };

    useEffect(() => {
        fetchQuestion();
    }, []);

    return (
        <div className="app-container">
            <h1 className="top-title">Which piwo is better?</h1>

            {question && (
                <div className="question-container">
                    <button className="beer-button" onClick={() => handleBeerClick(question.firstPiwoId)}>
                        {question.firstPiwoName}
                    </button>
                    <span className="vs-text">VS</span>
                    <button className="beer-button" onClick={() => handleBeerClick(question.secondPiwoId)}>
                        {question.secondPiwoName}
                    </button>
                </div>
            )}

            <div className="leaderboard-container">
                <button
                    className="leaderboard-button"
                    onClick={() => {
                        setShowLeaderboard(!showLeaderboard);
                        if (!showLeaderboard) fetchLeaderboard();
                    }}
                >
                    {showLeaderboard ? 'Hide Leaderboard' : 'Show Leaderboard'}
                </button>

                {showLeaderboard && (
                    <div className="leaderboard-list">
                        <h2>Leaderboard</h2>
                        <table className="leaderboard-table">
                            <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Name</th>
                                <th>Rating</th>
                            </tr>
                            </thead>
                            <tbody>
                            {leaderboard.map((piwo, index) => (
                                <tr key={piwo.id}>
                                    <td>{index + 1}</td>
                                    <td>{piwo.name}</td>
                                    <td>{piwo.rating}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
