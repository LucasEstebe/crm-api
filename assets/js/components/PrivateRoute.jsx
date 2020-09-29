import AuthContext from "../context/AuthContext";
import {Redirect, Route} from "react-router-dom";
import React, {useContext} from "react";

const PrivateRoute = ({path, component}) => {
    const {isAuthenticated} = useContext(AuthContext);
    return isAuthenticated ? <Route path={path} component={component}/> : <Redirect to={"/login"}/>
}

export default PrivateRoute