/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */
import React, {Fragment} from 'react';
import ReactDom from 'react-dom';
import {HashRouter, Switch, Route  } from "react-router-dom";

// any CSS you import will output into a single css file (app.css in this case)
import '../css/app.css';

// Components
import {Navbar} from "./components/Navbar";
import {HomePage} from "./pages/HomePage";
import {CustomersPage} from "./pages/CustomersPage";
import {InvoicesPage} from "./pages/InvoicesPage";

// Need jQuery? Install it with "yarn add jquery", then uncomment to import it.
// import $ from 'jquery';
const App = () =>{
    return <HashRouter>
            <Navbar/>
            <main className={"container mt-5"}>
                <Switch>
                    <Route exact={true} path={"/"} component={HomePage}/>
                    <Route path={"/customers"} component={CustomersPage}/>
                    <Route path={"/invoices"} component={InvoicesPage}/>
                </Switch>
            </main>
            </HashRouter>
};

const rootElement = document.querySelector('#app');
ReactDom.render(<App/>,rootElement);