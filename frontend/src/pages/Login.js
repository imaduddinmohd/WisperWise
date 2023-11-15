import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/login", {
          withCredentials: true,
        });
        navigate("/home");
      } catch (err) {}
    };
    checkLoggedIn();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    const handlePostRequest = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/login",
          {
            username,
            password,
          },
          {
            withCredentials: true,
          }
        );

        navigate("/home");
      } catch (err) {
        alert("login failed");
      }
    };
    handlePostRequest();
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleLogin}>
        <h2>Login</h2>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </label>
        <button type="submit" style={styles.button}>
          Login
        </button>
        <Link to="/register">
          <h3 style={styles.link}>Register Here</h3>
        </Link>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  form: {
    width: "80%",
    maxWidth: "400px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
  },
  input: {
    width: "100%",
    padding: "8px",
    margin: "8px 0",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#4caf50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  link: {
    textDecoration: "none",
    fontSize: "18px",
    textAlign: "center",
  },
};

export default LoginForm;
