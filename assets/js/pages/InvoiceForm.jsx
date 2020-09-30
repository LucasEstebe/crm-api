import React, {Fragment, useEffect, useState} from 'react';
import Field from "../components/forms/Field";
import {Link} from "react-router-dom";
import CustomersAPI from "../services/CustomersAPI";
import Select from "../components/forms/Select";
import InvoicesAPI from "../services/InvoicesAPI";


export const InvoiceForm = ({history, match}) => {
    const {id = "new"}= match.params;
    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status: "SENT"
    });

    const [customers, setCustomers] = useState([])

    const [editing, setEditing] = useState(false);

    const [errors, setErrors] = useState({
        amount: "",
        customer: "",
        status: ""
    })


    const fetchAllCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);
        } catch (error) {
            console.log(error.response) //TODO flash notification
            history.replace("/invoices");
        }
    };

    const fetchInvoice = async id => {
        try {
            const {amount, status, customer} = await InvoicesAPI.find(id)
            setInvoice({amount,status,customer: customer.id});
        }catch (error){
            console.log(error.response); // TODO flash notification
        }
    }

    // Loading customers if necessary
    useEffect(() =>{
        fetchAllCustomers();
    },[])

    useEffect(()=>{
        if (id !== "new"){
            setEditing(true);
            fetchInvoice(id);
        }
    }, [id])

    //Gestion des changement dans les inputs
    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setInvoice({...invoice, [name]: value})
    }

    const handleSubmit = async e => {
        e.preventDefault();
        console.log(invoice);
        try {
            if (editing){
                await InvoicesAPI.update(id,invoice);
            }else{
                await InvoicesAPI.create(invoice);
            }

          //TODO flash
        }catch ({response}) {
            const {violations} = response.data;

            console.log(response);

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
            {(!editing && <h1>Création d'une facture</h1>) || (<h1>Modification d'une facture</h1>)}

            <form onSubmit={handleSubmit}>
                <Field name={"amount"}
                       label={"Montant"}
                       placeholder={"Montant de la facture"} value={invoice.amount} onChange={handleChange}
                       error={errors.amount}/>

                <Select name={"customer"}
                        label={"Client"}
                        value={invoice.customer}
                        onChange={handleChange}
                        error={errors.customer}>

                    {customers.map((c,index)=>{
                        return <option key={index} value={c.id} >{c.firstName} {c.lastName}</option>
                    })}

                </Select>

                <Select name={"status"}
                        label={"Statut"}
                        value={invoice.status}
                        onChange={handleChange}
                        error={errors.status}>
                    <option value={"SENT"}>Envoyée</option>
                    <option value={"PAID"}>Payée</option>
                    <option value={"CANCELLED"}>Annulée</option>
                </Select>

                <div className={"form-group"}>
                    <button type={"submit"} className={"btn btn-success"}>Enregistrer</button>
                    <Link to={'/invoices'} className={"btn btn-link"}>Retour à la liste</Link>
                </div>
            </form>
        </Fragment>
    )
}
