import React, {Fragment, useEffect, useState} from 'react';
import Field from "../components/forms/Field";
import {Link} from "react-router-dom";
import CustomersAPI from "../services/CustomersAPI";
import axios from "axios";


export const CustomerPage = ({history, match}) => {
    const {id = "new"}= match.params;

    const [customer, setCustomer] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""

    })

    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""

    })

    const [editing, setEditing] = useState(false);

    // Get a customer by id
    const fetchCustomer = async id =>{
        try {
            const {firstName, lastName, email, company } = CustomersAPI.find(id);
            setCustomer({firstName,lastName,email,company});
        }catch (error) {
            history.replace("/customers");
        } //TODO notification

    }

    // Loading customer if necessary
    useEffect(() =>{
            if (id !== "new"){
                setEditing(true);
                fetchCustomer(id);
            }
        },[id])


    //Gestion des changement dans les inputs
    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setCustomer({...customer, [name]: value})
    }

    //Gestion du submit
    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if (editing){
               await CustomersAPI.update(id, customer);
                //TODO flash notification
            } else{
                await CustomersAPI.create(customer);
                //TODO flash notification
                history.replace("/customers");
            }
            //TODO flash notification
            setErrors({});
        }catch ({response}) {
            const {violations} = response.data;

            if(violations){
                const apiErrors = {};
                violations.map(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
            });

            setErrors(apiErrors);
            //TODO flash notification
        }}
    }

    return (
        <Fragment>
            {(!editing && <h1>Création d'un client</h1>) || (<h1>Modification d'un client</h1>)}

            <form onSubmit={handleSubmit}>
                <Field name={"lastName"}
                       label={"Nom de famille"}
                       placeholder={"Nom de famille du client"} value={customer.lastName} onChange={handleChange}
                       error={errors.lastName}/>
                <Field name={"firstName"} label={"Prénom"} placeholder={"Prénom du client"} value={customer.firstName}
                       onChange={handleChange} error={errors.firstName}/>
                <Field name={"email"} label={"Email"} placeholder={"Adresse email du client"} type={"email"}
                       value={customer.email} onChange={handleChange} error={errors.email}/>
                <Field name={"company"} label={"Entreprise"} placeholder={"Entreprise du client"}
                       value={customer.company} onChange={handleChange} error={errors.company}/>

                <div className={"form-group"}>
                    <button type={"submit"} className={"btn btn-success"}>Enregistrer</button>
                    <Link to={'/customers'} className={"btn btn-link"}>Retour à la liste</Link>
                </div>
            </form>
        </Fragment>
    )
}
