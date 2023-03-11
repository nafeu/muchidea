import React, { Fragment } from "react";
import { Link } from "react-router-dom";

const Footer = ({ user, firebase }) => {
  return (
    <div className="page-footer">
      <Credits />
    </div>
  );
};

const Credits = () => (
  <Fragment>
    <Link to="/privacy-policy">Privacy Policy</Link> | Much Idea was made with love by <a href="https://nafeu.com/about">Nafeu</a> | <a href="https://www.buymeacoffee.com/nafeunasir">Want To Support The App? Buy Me A Coffee :)</a>
  </Fragment>
)

export default Footer;
