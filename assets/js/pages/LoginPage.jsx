import React, {Fragment, useContext, useState} from 'react';
import authAPI from "../services/authAPI";
import AuthContext from "../context/AuthContext";

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
            await authAPI.authenticate(credentials);
            setError("");
            setIsAuthenticated(true);
            history.replace("/customers");
        }catch (e) {
            setError("Invalid email or password")
        }
    }

    return <Fragment>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor={"username"}>Email address</label>
                <input type="username"
                       className={"form-control " + (error && "is-invalid")}
                       name={"username"}
                       id={"username"}
                       value={credentials.username}
                       onChange={handleChange}
                       placeholder="Adresse email de connexion"/>
                {error &&
                    <p className={"invalid-feedback"}>{error}</p>
                }
            </div>
            <div className="form-group">
                <label htmlFor={"password"}>Password</label>
                <input type="password"
                       id={"password"}
                       name={"password"}
                       className="form-control"
                       value={credentials.password}
                       onChange={handleChange}
                       placeholder="Password"/>
            </div>
            <div className={"form-group"}>
                <button type={"submit"} className={"btn btn-success"}>Je me connecte</button>
            </div>
        </form>
    </Fragment>
}