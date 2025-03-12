import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { isTokenExpired } from "../../utils/token"; // Import the utility function

const AuthCheck = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const tokenCheck = isTokenExpired(token);
    if (tokenCheck) {
      localStorage.removeItem("token");
      navigate("/"); // Redirect to main page if token is expired
    }
  }, [location, navigate]); // Run this on page load and route change

  return (
    <>{children}</>
  )
};

export default AuthCheck;
