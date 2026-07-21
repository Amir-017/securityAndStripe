import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const GoogleSuccess = () => {

  const location = useLocation();
  const navigate = useNavigate(); 

  useEffect(() => {

    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    console.log(token);
    console.log(params);

    if (token) {
      localStorage.setItem("token", token);


      navigate("/");
    }
  }, []);

  return (
    <div>
      <h2>Logging you in...</h2>
    </div>
  );
};

export default GoogleSuccess;