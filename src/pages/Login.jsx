import React, { useState } from "react";
import axios from "axios";

export default function Login({ onLogin }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.post("/api/auth/login", {
        email,
        password
      });

      console.log("SUCCESS:", res.data);

      localStorage.setItem("token", res.data.token);

      onLogin();

    } catch (err) {
      console.log("ERROR:", err.response?.data);
      alert("Login failed");
    }
  };

  return (
    <div style={styles.wrapper}>

      <div style={styles.card}>
        <h2>ERP Login</h2>

        <input
          placeholder="admin"
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="1234"
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={login} style={styles.button}>
          Login
        </button>

      </div>

    </div>
  );
}

const styles = {
  wrapper: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a"
  },
  card: {
    width: 350,
    padding: 30,
    background: "white",
    borderRadius: 12
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10
  },
  button: {
    width: "100%",
    padding: 10,
    background: "#2563eb",
    color: "white",
    border: "none"
  }
};