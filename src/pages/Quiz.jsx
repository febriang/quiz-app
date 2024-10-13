import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GiSpades } from "react-icons/gi";
import { FaRegHeart } from "react-icons/fa";
import { BsDiamond } from "react-icons/bs";
import { BsSuitClubFill } from "react-icons/bs";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(90);
  const [userAnswers, setUserAnswers] = useState([]);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const navigate = useNavigate();

  const shuffleArray = (array) => {
    let newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const icons = [
    <GiSpades />,
    <FaRegHeart />,
    <BsDiamond />,
    <BsSuitClubFill />,
  ];

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          "https://opentdb.com/api.php?amount=10&category=31&type=multiple"
        );
        if (response.status === 429) {
          console.log("Too many requests. Please wait.");
          return;
        }

        const data = await response.json();
        setQuestions(data.results);
        const shuffled = data.results.map((question) =>
          shuffleArray([...question.incorrect_answers, question.correct_answer])
        );
        setShuffledAnswers(shuffled);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    const savedState = JSON.parse(localStorage.getItem('quizState'));
    if (savedState) {
      setQuestions(savedState.questions);
      setCurrentQuestion(savedState.currentQuestion);
      setScore(savedState.score);
      setTimer(savedState.timer);
      setUserAnswers(savedState.userAnswers);
      setShuffledAnswers(savedState.shuffledAnswers);
    } else {
      fetchQuestions();
    }
  }, []);

  useEffect(() => {
    if (timer === 0) {
      navigate("/result", { state: { score, total: questions.length } });
    }
    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(countdown);
  }, [timer, navigate, questions.length]);

  useEffect(() => {
    const saveState = () => {
      const state = {
        questions,
        currentQuestion,
        score,
        timer,
        userAnswers,
        shuffledAnswers
      };
      localStorage.setItem('quizState', JSON.stringify(state));
    };

    window.addEventListener('beforeunload', saveState);
    return () => window.removeEventListener('beforeunload', saveState);
  }, [questions, currentQuestion, score, timer, userAnswers, shuffledAnswers]);

  const handleAnswer = (answer) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);

    if (answer === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinishQuiz = () => {
    localStorage.removeItem('quizState');
    navigate("/result", { state: { score, total: questions.length } });
  };

  const allQuestionsAnswered =
    userAnswers.length === questions.length &&
    userAnswers.every((answer) => answer !== undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300">
      {questions.length > 0 ? (
        <div className="flex w-full max-w-4xl">
          {/* Section for Question Numbers */}
          <div className="flex flex-col items-center max-h-fit bg-gray-100 rounded-lg shadow-lg mr-4 p-2">
            <h2 className="text-lg font-bold mt-2 mb-4">Questions</h2>
            <div className="grid grid-cols-4 gap-2">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-10 h-10 flex items-center justify-center rounded-full 
                  ${
                    userAnswers[index] !== undefined
                      ? "bg-purple-700 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
          {/* Section for the Questions */}
          <div className="flex-1 p-4 bg-gray-100 rounded-lg shadow-lg">
            {/* Top Section: Question Number and Timer */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Question {currentQuestion + 1}
              </h2>
              <p className="text-xl font-bold">
                {Math.floor(timer / 60)}:
                {timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
              </p>
            </div>

            {/* Question Text */}
            <p
              className="text-center text-lg mb-8 mt-8 text-gray-700"
              dangerouslySetInnerHTML={{
                __html: questions[currentQuestion].question,
              }}
            ></p>

            {/* Answer Buttons */}
            <div className="grid grid-cols-2 gap-4">
              {shuffledAnswers[currentQuestion]?.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(answer)}
                  className={`py-4 bg-purple-200 text-purple-700 font-bold rounded-lg flex items-center justify-center
                  ${
                    userAnswers[currentQuestion] === answer
                      ? "bg-purple-700 text-purple-200"
                      : ""
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span className="hover:scale-125 transition-transform duration-300 ease-in-out">
                      {icons[index % icons.length]}
                    </span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: answer,
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
                className={`py-2 px-4 rounded-lg text-white 
                ${
                  currentQuestion === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gray-400 hover:bg-gray-500"
                }`}
              >
                Previous
              </button>

              {currentQuestion + 1 < questions.length ? (
                <button
                  onClick={handleNextQuestion}
                  className="py-2 px-4 bg-purple-700 text-white rounded-lg hover:bg-purple-500"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleFinishQuiz}
                  disabled={!allQuestionsAnswered}
                  className={`py-2 px-4 rounded-lg text-white 
                  ${
                    allQuestionsAnswered
                      ? "bg-green-600 hover:bg-green-500"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Finish
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-purple-700 text-lg">Loading questions...</p>
        </div>
      )}
    </div>
  );
};

export default Quiz;
