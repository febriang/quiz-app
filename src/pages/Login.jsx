import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GiSpades } from "react-icons/gi";
import { FaRegHeart } from "react-icons/fa";
import { BsFillSuitDiamondFill } from "react-icons/bs";
import { PiClub } from "react-icons/pi";

const Login = () => {
  const [username, setUsername] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [hasUnfinishedQuiz, setHasUnfinishedQuiz] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    }

    const quizState = localStorage.getItem("quizState");
    if (quizState) {
      setHasUnfinishedQuiz(true);
    }
  }, []);

  const handleLogin = () => {
    if (username) {
      setShowModal(true);
    }
  };

  const handleResumeQuiz = () => {
    navigate("/quiz");
  };

  useEffect(() => {
    let timer;
    if (showModal && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);
    } else if (countdown === 0) {
      localStorage.setItem("username", username);
      navigate("/quiz");
    }

    return () => clearInterval(timer);
  }, [showModal, countdown, username, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-300">
      <div className="flex flex-col items-center bg-white p-8 rounded shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
        <div className="grid grid-flow-col auto-cols-max gap-2 mt-4">
          <GiSpades size="20px" className="hover:scale-125 transition-transform duration-300 ease-in-out" />
          <FaRegHeart color="#7E22CE" size="20px" className="hover:scale-125 transition-transform duration-300 ease-in-out" />
          <BsFillSuitDiamondFill size="20px" className="hover:scale-125 transition-transform duration-300 ease-in-out" />
          <PiClub color="#7E22CE" size="20px" className="hover:scale-125 transition-transform duration-300 ease-in-out" />
        </div>
        <h2 className="text-3xl font-bold text-purple-700 mb-8 mt-4">
          Quiz App
        </h2>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-300 p-2 rounded mb-4 w-64 focus:border-purple-700 focus:outline-none transition-colors duration-200"
        />
        <button
          onClick={handleLogin}
          disabled={!username}
          className={`px-4 py-2 rounded w-64 text-white transition-all duration-300 ease-in-out ${
            username
              ? "bg-purple-700 hover:bg-purple-500"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Start Quiz
        </button>
        {hasUnfinishedQuiz && (
          <button
            onClick={handleResumeQuiz}
            className="mt-4 px-4 py-2 rounded w-64 text-white bg-teal-600 hover:bg-teal-500 transition-all duration-300 ease-in-out"
          >
            Resume Quiz
          </button>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h3 className="text-2xl font-bold mb-4 text-purple-700">
              Welcome, {username}!
            </h3>
            <p className="text-lg">Starting the quiz in</p>
            <p className="text-2xl font-bold">{countdown}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;