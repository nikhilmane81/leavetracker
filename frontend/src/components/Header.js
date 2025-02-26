import React from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const Header = ({ title }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm p-3">
      <h2 className="navbar-brand">{title}</h2>
      <div className="ms-auto">
        <button className="btn btn-primary me-2" onClick={() => navigate("/dashboard")}>
          Dashboard
        </button>
        <LogoutButton />
      </div>
    </nav>
  );
};

export default Header;
