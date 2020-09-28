import React, {Fragment, useEffect, useState} from 'react';

export const LoginPage = (props) => {
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    })

    const handleChange = event => {
        const value = event.currentTarget.value;
        const name = event.currentTarget.name;

        setCredentials({...credentials, [name]: value})
    }

    const handleSubmit = event =>{
        event.preventDefault();
        console.log(credentials);
    }

    return <Fragment>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor={"email"}>Email address</label>
                <input type="email"
                       className="form-control"
                       name={"email"}
                       id={"email"}
                       value={credentials.email}
                       onChange={handleChange}
                       placeholder="Adresse email de connexion"/>
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