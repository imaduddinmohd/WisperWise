import React, { useState } from "react";
import axios from "axios";
import Joi from "joi";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const [isError, setIsError] = useState("");

  const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/
    ),
    confirmPassword: Joi.string().required(),
  });

  const handleRegister = (e) => {
    e.preventDefault();

    const { error } = registerSchema.validate({
      username,
      password,
      confirmPassword,
    });

    if (error) {
      setIsError(error.details[0].message);
      return;
    }

    if (password !== confirmPassword) {
      setIsError("password and confirm password not same");
      return;
    }

    const handlePostRequest = async () => {
      try {
        const response = await axios.post(
          "/api/register",
          {
            username,
            password,
          },
          {
            withCredentials: true,
          }
        );

        navigate("/");
      } catch (err) {
        setIsError(
          "User with given username already exists!! user couldn't be registered"
        );
      }
    };

    handlePostRequest();
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleRegister}>
        <h2 style={{ marginBottom: "25px" }}>Register</h2>
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

        <label>
          Confirm Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
          />
        </label>

        <button type="submit" style={styles.button}>
          Register
        </button>
        <h3
          style={{
            color: "red",
            marginTop: "20px",
            textAlign: "center",
            height: "100px",
            fontWeight: 400,
            fontSize: "18px",
          }}
        >
          {isError}
        </h3>
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
};

export default RegisterForm;
