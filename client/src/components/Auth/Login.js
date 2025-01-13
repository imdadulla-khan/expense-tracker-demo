import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      alert("Login Successful!");
      navigate("/expenses");
    } catch (error) {
      alert("Login failed. Check your credentials.");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {/* Link to Register */}
      <p>
        New user? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
};

export default Login;
