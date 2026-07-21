import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthSuccess = () => {

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {

    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    localStorage.setItem("token", token);
    navigate("/");
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h2 className="text-xl text-gray-700">Logging you in...</h2>
    </div>
  );
};

export default AuthSuccess;
