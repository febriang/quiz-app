import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Result = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { score, total } = location.state || { score: 0, total: 0 }; 
  const [highScore, setHighScore] = useState(0);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const storedHighScore = localStorage.getItem("highScore");
    if (storedHighScore) {
      setHighScore(Number(storedHighScore));
    }

    if (score > storedHighScore) {
      localStorage.setItem("highScore", score);
      setHighScore(score);
    }
  }, [score]);

  const handleRestart = () => {
    navigate("/quiz");
  };

  const handleLogout = () => {
    localStorage.removeItem("username"); 
    localStorage.removeItem("highScore"); 
    navigate("/"); 
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-300">
      <div className="flex flex-col items-center bg-white w-80 h-80 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
        <h2 className="text-2xl font-bold text-purple-700 mb-4 border-b-2 border-purple-700 pb-2">
          Quiz Result
        </h2>
        <p className="text-lg text-gray-700 mb-2">
          Correct Answers: <span className="font-bold">{score}</span>
        </p>
        <p className="text-lg text-gray-700 mb-2">
          Total Questions: <span className="font-bold">{total}</span>
        </p>
        <p className="text-lg font-medium text-purple-700">
          {username} your highscore is
        </p>
        <p className="text-3xl font-bold text-purple-800 mb-4">{highScore}</p>

        <div className="flex-grow"></div>

        <div className="flex space-x-4 mt-auto">
          <button
            onClick={handleRestart}
            className="px-4 py-2 bg-purple-700 text-white rounded-lg shadow-md hover:bg-purple-500 transition-all duration-300"
          >
            Restart Quiz
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-500 transition-all duration-300"
          >
            Quit Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
