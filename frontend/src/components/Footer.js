import React from "react";

const Footer = () => {
  return (
    <footer className="bg-light text-center p-3 mt-5 shadow-sm">
      <p className="mb-0">© {new Date().getFullYear()} Leave Management System. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
