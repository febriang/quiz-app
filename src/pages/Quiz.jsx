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
  const [timer, setTimer] = useState(300);
  const [userAnswers, setUserAnswers] = useState([]);
  const [shuffledAnswers, setShuffledAnswers] = useState([]); // Untuk menyimpan jawaban yang sudah diacak per soal
  const navigate = useNavigate();

  // Fungsi untuk mengacak array (menggunakan algoritma Fisher-Yates)
  const shuffleArray = (array) => {
    let newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  // Daftar ikon
  const icons = [
    <GiSpades />,
    <FaRegHeart />,
    <BsDiamond />,
    <BsSuitClubFill />,
  ];

  // Ambil soal dari API OpenTDB (atau gunakan data dummy saat testing)
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          "https://opentdb.com/api.php?amount=10&category=31&type=multiple"
        );
        if (response.status === 429) {
          console.log("Too many requests. Please wait.");
          // Tambahkan logika untuk menunggu beberapa saat
          return;
        }

        const data = await response.json();
        setQuestions(data.results);

        // Acak jawaban untuk setiap soal dan simpan urutannya
        const shuffled = data.results.map((question) =>
          shuffleArray([...question.incorrect_answers, question.correct_answer])
        );
        setShuffledAnswers(shuffled);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  // Fungsi untuk menangani jawaban yang dipilih oleh user
  const handleAnswer = (answer) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer; // Simpan jawaban untuk soal saat ini
    setUserAnswers(newAnswers);

    // Hitung score jika jawaban benar
    if (answer === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }
  };

  // Tombol Next dan Previous
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

  // Fungsi untuk menyelesaikan kuis
  const handleFinishQuiz = () => {
    navigate("/result", { state: { score, total: questions.length } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-300">
      {questions.length > 0 ? (
        <div className="w-full max-w-2xl p-4 bg-gray-100 rounded-lg shadow-lg">
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
                    ? "bg-purple-800 text-purple-200"
                    : ""
                }`}
              >
                <div className="flex flex-col items-center">
                  <span className="hover:scale-125 transition-transform duration-300 ease-in-out">{icons[index % icons.length]}</span>
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
                className="py-2 px-4 bg-purple-700 text-white rounded-lg"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleFinishQuiz}
                className="py-2 px-4 bg-green-600 text-white rounded-lg"
              >
                Finish
              </button>
            )}
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
