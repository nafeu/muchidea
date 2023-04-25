import React, { Fragment } from "react";
import { Link } from "react-router-dom";

const Footer = ({ user, firebase, className }) => {
  return (
    <div className={`page-footer ${className}`}>
      <Credits />
    </div>
  );
};

const Credits = () => (
  <div className="flex mt-2 gap-2 justify-center text-sm">
    <Link className="brightness-50 bg-secondary text-primary px-1.5 py-1 rounded-md" to="/privacy-policy">Privacy Policy</Link>
    <div className="bg-secondary text-primary px-1.5 py-1 rounded-md">Much Idea was made with ❤️ by <a className="hover:opacity-75" href="https://nafeu.com/about">Nafeu</a></div>
    <div className="bg-primary text-secondary px-1.5 py-1 rounded-md font-bold hover:opacity-75"><a href="https://www.buymeacoffee.com/nafeunasir">Want To Support The App? Buy Me A Coffee 😊</a></div>
  </div>
)

export default Footer;
