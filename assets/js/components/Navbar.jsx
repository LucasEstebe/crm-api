import React, {Fragment, useContext} from 'react';
import authAPI from "../services/authAPI";
import {NavLink} from "react-router-dom";
import AuthContext from "../context/AuthContext";

export const Navbar = ({history}) => {

    const {isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

    const handleLogout = () => {
        authAPI.logout();
        setIsAuthenticated(false);
        history.push("/login");
    }



    return (<nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <NavLink className="navbar-brand" to={"/"}>SymReact !</NavLink>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01"
                aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarColor01">
            <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                    <NavLink className="nav-link" to={"/customers"}>Clients</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to={"/invoices"}>Factures</NavLink>
                </li>
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button"
                       aria-haspopup="true" aria-expanded="false">Dropdown</a>
                    <div className="dropdown-menu">
                        <a className="dropdown-item" href="#">Action</a>
                        <a className="dropdown-item" href="#">Another action</a>
                        <a className="dropdown-item" href="#">Something else here</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#">Separated link</a>
                    </div>
                </li>
            </ul>
            <ul className={"navbar-nav ml-auto"}>
                {(!isAuthenticated &&
                    (<Fragment>
                        <li className={"nav-item"}>
                            <NavLink to={"/register"} className={"nav-link"}> Inscription </NavLink>
                        </li>
                        <li className={"nav-item"}>
                            <NavLink to={"/login"} className={"btn btn-success"}> Connexion !</NavLink>
                        </li>
                    </Fragment>))
                    ||
                    (<li className={"nav-item"}>
                        <button onClick={handleLogout} className={"btn btn-danger"}> Déconnexion !</button>
                    </li>
                )}
            </ul>
        </div>
    </nav>)
}