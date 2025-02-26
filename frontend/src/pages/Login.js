import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      navigate(res.data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      setModalMessage("Invalid credentials. Please try again.");
      setShowModal(true);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(to right, #667eea, #764ba2)",
      }}
    >
      <div
        className="card p-4 shadow-lg text-white"
        style={{
          width: "350px",
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          borderRadius: "15px",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <h2 className="text-center mb-3">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                color: "#fff",
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                color: "#fff",
              }}
            />
          </div>
          <button
            type="submit"
            className="btn w-100"
            style={{
              background: "rgba(255, 255, 255, 0.3)",
              color: "#fff",
              border: "none",
              fontWeight: "bold",
            }}
          >
            Login
          </button>
        </form>
        <p className="mt-3 text-center">
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#fff", fontWeight: "bold" }}>
            Sign up here
          </Link>
        </p>
      </div>

      {/* Error Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login Failed</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Login;
