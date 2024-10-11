import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(180);  // Total 3 menit (180 detik) untuk seluruh kuis
  const [userAnswers, setUserAnswers] = useState([]);  // Menyimpan jawaban user
  const navigate = useNavigate();

  // Mengambil soal dari API OpenTDB (atau gunakan data dummy saat testing)
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('https://opentdb.com/api.php?amount=10&category=31&type=multiple');
        if (response.status === 429) {
          console.log('Too many requests. Please wait.');
          // Tambahkan logika untuk menunggu beberapa saat
          return;
        }
        const data = await response.json();
        setQuestions(data.results);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
  
    fetchQuestions();
  }, []);

  // Menggunakan timer untuk seluruh kuis
  useEffect(() => {
    if (timer === 0) {
      navigate('/result', { state: { score, total: questions.length } });
    }
    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(countdown);
  }, [timer, navigate, questions.length]);

  // Fungsi untuk menyimpan jawaban yang dipilih oleh user
  const handleAnswer = (answer) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;  // Simpan jawaban untuk soal saat ini
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
    navigate('/result', { state: { score, total: questions.length } });
  };

  return (
    <div>
      {questions.length > 0 ? (
        <div>
          <h2>Question {currentQuestion + 1}</h2>
          <p>{questions[currentQuestion].question}</p>
          <div>
            {questions[currentQuestion].incorrect_answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(answer)}
                style={{
                  backgroundColor: userAnswers[currentQuestion] === answer ? 'lightgreen' : 'white'
                }}
              >
                {answer}
              </button>
            ))}
            <button
              onClick={() => handleAnswer(questions[currentQuestion].correct_answer)}
              style={{
                backgroundColor: userAnswers[currentQuestion] === questions[currentQuestion].correct_answer ? 'lightgreen' : 'white'
              }}
            >
              {questions[currentQuestion].correct_answer}
            </button>
          </div>

          {/* Timer 3 menit untuk seluruh kuis */}
          <p>Time Remaining: {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}</p>

          {/* Tombol Previous */}
          <button onClick={handlePreviousQuestion} disabled={currentQuestion === 0}>
            Previous
          </button>

          {/* Tombol Next jika bukan soal terakhir, Finish jika soal terakhir */}
          {currentQuestion + 1 < questions.length ? (
            <button onClick={handleNextQuestion}>
              Next
            </button>
          ) : (
            <button onClick={handleFinishQuiz}>
              Finish
            </button>
          )}
        </div>
      ) : (
        <p>Loading questions...</p>
      )}
    </div>
  );
};

export default Quiz;
