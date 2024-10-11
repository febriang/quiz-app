import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GiSpades } from "react-icons/gi";
import { FaRegHeart } from "react-icons/fa";
import { BsFillSuitDiamondFill } from "react-icons/bs";
import { PiClub } from "react-icons/pi";

const Login = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username) {
      localStorage.setItem("username", username);
      navigate("/quiz");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col items-center bg-white p-8 rounded shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
        <div className="grid grid-flow-col auto-cols-max gap-2 mt-4">
          <GiSpades
            size="20px"
            className="hover:scale-125 transition-transform duration-300 ease-in-out"
          />
          <FaRegHeart
            color="#7E22CE"
            size="20px"
            className="hover:scale-125 transition-transform duration-300 ease-in-out"
          />
          <BsFillSuitDiamondFill
            size="20px"
            className="hover:scale-125 transition-transform duration-300 ease-in-out"
          />
          <PiClub
            color="#7E22CE"
            size="20px"
            className="hover:scale-125 transition-transform duration-300 ease-in-out"
          />
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
          className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-500 transition-all duration-300 ease-in-out w-64"
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default Login;
