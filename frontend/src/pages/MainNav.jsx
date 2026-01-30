import React from "react";
import { NavLink } from "react-router-dom";

const MainNav = () => {
    return (
        <nav className="navbar navbar-expand-lg sticky-top">
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="/">
                    <img src="/noBackgroundLogo.png" alt="logo" width="80" height="60"></img>
                    <span className="ms-2 navText brand-name fw-normal">Loops & Knots</span>
                </NavLink>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse text-center" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink className="nav-link navText" to="/">Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link navText" to="/yarn">Yarn</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link navText" to="/patterns">Patterns</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link navText" to="/tutorials">Tutorials</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link navText" to="/profile">My Profile</NavLink>
                        </li>

                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default MainNav;

