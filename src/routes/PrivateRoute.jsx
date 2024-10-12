import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const username = localStorage.getItem("username");

  if (!username) {
    // Jika user belum login, arahkan ke halaman login
    return <Navigate to="/" />;
  }

  // Jika user sudah login, tampilkan halaman yang diakses
  return <Outlet />;
};

export default PrivateRoute;
