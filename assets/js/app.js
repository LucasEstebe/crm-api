/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */
import React, {Fragment, useContext, useState} from 'react';
import ReactDom from 'react-dom';
import {HashRouter, Switch, Route, withRouter, Redirect  } from "react-router-dom";

// any CSS you import will output into a single css file (app.css in this case)
import '../css/app.css';

// Components
import {Navbar} from "./components/Navbar";
import {HomePage} from "./pages/HomePage";
import {CustomersPage} from "./pages/CustomersPage";
import {InvoicesPage} from "./pages/InvoicesPage";
import {LoginPage} from "./pages/LoginPage";
import authAPI from "./services/authAPI";

// Context
import AuthContext from "./context/AuthContext";

authAPI.setup();

const PrivateRoute = ({path, component}) => {
    const {isAuthenticated} = useContext(AuthContext);
    return isAuthenticated ? <Route path={path} component={component}/> : <Redirect to={"/login"}/>
}

const App = () =>{
    const [isAuthenticated, setIsAuthenticated] = useState(authAPI.isAuthenticated());

    const contextValue = {
        isAuthenticated,
        setIsAuthenticated
    }

    const NavbarWithRouter = withRouter(Navbar);

    return (
        <AuthContext.Provider value={contextValue}>
        <HashRouter>
            <NavbarWithRouter/>
            <main className={"container mt-5"}>
                <Switch>

                    <Route exact={true} path={"/"} component={HomePage}/>

                    <PrivateRoute path={"/customers"} component={CustomersPage} />

                    <PrivateRoute path={"/invoices"} component={InvoicesPage}/>

                    <Route path={'/login'} render={props =>
                        <LoginPage {...props}/>
                    }/>
                </Switch>
            </main>
            </HashRouter>
        </AuthContext.Provider>
    )
};

const rootElement = document.querySelector('#app');
ReactDom.render(<App/>,rootElement);