import React, {Fragment, useContext, useState} from 'react';
import AuthAPI from "../services/AuthAPI";
import AuthContext from "../context/AuthContext";
import Field from "../components/forms/Field";

export const LoginPage = ({history}) => {

    const { setIsAuthenticated } = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    })

    const [error, setError] = useState("");

    //Gestion des champs
    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setCredentials({...credentials, [name]: value})
    }

    // Gestion du submit
    const handleSubmit = async event =>{
        event.preventDefault();
        try {
            await AuthAPI.authenticate(credentials);
            setError("");
            setIsAuthenticated(true);
            history.replace("/customers");
        }catch (e) {
            setError("Invalid email or password")
        }
    }

    return <Fragment>
        <form onSubmit={handleSubmit}>
            <Field label={"Email address"}
                   type={"email"}
                   name={"username"}
                   placeholder={"Adresse email de connexion"}
                   value={credentials.username}
                   onChange={handleChange}
                   error={error}
            />
            <Field
                name={"password"}
                label={"Password"}
                value={credentials.password}
                onChange={handleChange}
                type={"password"}
            />
            <div className={"form-group"}>
                <button type={"submit"} className={"btn btn-success"}>Je me connecte</button>
            </div>
        </form>
    </Fragment>
}