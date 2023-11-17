import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const response = await axios.get("/api/login", {
          withCredentials: true,
        });
        navigate("/home");
      } catch (err) {
        setIsLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    const handlePostRequest = async () => {
      try {
        const response = await axios.post(
          "/api/login",
          {
            username,
            password,
          },
          {
            withCredentials: true,
          }
        );

        // setIsLoading(false);

        navigate("/home");
      } catch (err) {
        setIsError(true);
      }
    };
    handlePostRequest();
  };

  if (isLoading)
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <h1 style={styles.heading}>
          Welcome to WisperWise: <br /> Where Conversations Unfold
        </h1>

        <p>
          Engage in meaningful discussions with WisperWise, the ultimate
          platform for creating and joining virtual rooms. Whether you're
          connecting with friends, colleagues, or fellow enthusiasts, WisperWise
          provides a space where your conversations come to life.
        </p>
      </div>
      <form style={styles.form} onSubmit={handleLogin}>
        <h2 style={{ marginBottom: "25px" }}>Login</h2>
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

        <h3
          style={{
            color: "red",
            marginTop: "20px",
            textAlign: "center",
            fontWeight: 400,
          }}
        >
          {isError ? " Username or Password Incorrect" : ""}
        </h3>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
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
    marginTop: "30px",
  },
  left: {
    maxWidth: "800px",
    marginRight: "50px",
    display: "flex",
    flexDirection: "column",
    gap: "40px",
  },
  heading: {
    color: "#4caf50",
  },
};

export default LoginForm;
