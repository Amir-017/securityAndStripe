import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import { Login } from "./Pages/Login_Register/Login";
import { Register } from "./Pages/Login_Register/Register";
import AuthSuccess from "./auth/success";
import Success from "./Pages/Payment_Success_cancel/Success";
import Cancel from "./Pages/Payment_Success_cancel/Cancel";
import NavBar from "./components/NavBar";

function App() {
  return (
    <div className="App">
      <NavBar />
      <div className="pt-16">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/payment/success" element={<Success />} />
        <Route path="/payment/cancel" element={<Cancel />} />
      </Routes>
      </div>
    </div>
  );
}

export default App;