import { useLocation } from 'react-router-dom';

const Result = () => {
  const location = useLocation();
  const { score, total } = location.state;

  return (
    <div>
      <h2>Quiz Result</h2>
      <p>Correct Answers: {score}</p>
      <p>Total Questions: {total}</p>
    </div>
  );
};

export default Result;
