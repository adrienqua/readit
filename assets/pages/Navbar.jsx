import React, { useState, useEffect } from "react"
import { Link, NavLink } from "react-router-dom"
import { logout } from "../services/loginAPI"

const Navbar = (props) => {
    const { user } = props
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <img src="/logo.png" alt="" /> Readit{" "}
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                {!user.username && (
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <div className="navbar-nav">
                            <React.Fragment>
                                <NavLink
                                    className="nav-item nav-link"
                                    to="/login"
                                >
                                    Connexion
                                </NavLink>
                                <NavLink
                                    className="nav-item nav-link"
                                    to="/register"
                                >
                                    Créer un compte
                                </NavLink>
                            </React.Fragment>
                        </div>
                    </div>
                )}
                {user.username && (
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <div className="navbar-nav">
                            <React.Fragment>
                                <NavLink
                                    className="nav-item nav-link"
                                    to={`/user/${user.username}`}
                                >
                                    {user.username}
                                    <small>
                                        <i
                                            className="fa fa-fw fa-certificate text-primary"
                                            aria-hidden="true"
                                        ></i>
                                        {user.karma}
                                    </small>
                                </NavLink>
                                <NavLink
                                    className="nav-item nav-link"
                                    to="/about"
                                >
                                    A propos
                                </NavLink>
                                <a
                                    className="nav-item nav-link"
                                    href=""
                                    onClick={() => logout()}
                                ></a>
                            </React.Fragment>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
