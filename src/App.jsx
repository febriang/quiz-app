import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Login />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/result" element={<Result />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
