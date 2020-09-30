import React, {Fragment, useEffect, useState} from 'react';
import {Pagination} from "../components/Pagination";
import InvoicesAPI from "../services/InvoicesAPI";
import moment from "moment";
import {Link} from "react-router-dom";

const STATUS_CLASSES = {
    PAID: "success",
    SENT: "primary",
    CANCELLED: "danger"
}

const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyée",
    CANCELLED: "Annulée"
}


export const InvoicesPage = (props) => {
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    const itemsPerPage = 10;

    // Get invoices from API
    const fetchInvoices = async () => {
        try {
            const data =  await InvoicesAPI.findAll();
            setInvoices(data);
        }catch (error) {console.log(error)}
    }

    useEffect(()=>{
        fetchInvoices()
    },[]);


    // Gestion de ka supression d'un customer
    const handleDelete = async (id) => {
        const originalInvoices = [...invoices];
        // 1. L'approche optimiste
        setInvoices(invoices.filter(invoice => invoice.id !== id));
        // L'approche pessimiste
        try {
            await InvoicesAPI.delete(id)
        } catch (error) {
            console.log(error.response);
            setInvoices(originalInvoices);
        }
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    //Gestion de la recherche
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    }

    const formatDate = str => {return moment(str).format('DD/MM/YYYY')}

    // gestion de la recherche
    const filteredInvoices = invoices.filter(
        i =>
            i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
            i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            i.amount.toString().includes(search.toLowerCase()) ||
            STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
    );


    // Pagination des données
    const paginatedInvoices = Pagination.getData(filteredInvoices, currentPage, itemsPerPage);

    return (
        <Fragment>
            <div className={"d-flex justify-content-between align-items-center"}>
                <h1>Liste des Factures</h1>
                <Link className={"btn btn-success"} to={"/invoices/new"}>Créer une facture</Link>
            </div>

            <div className={"form-group"}>
                <input type={"text"} onChange={handleSearch} value={search} className={"form-control"} placeholder={"Rechercher..."}/>
            </div>

            <table className={"table table-hover"}>
                <thead>
                <tr>
                    <th>Numéro</th>
                    <th>Client</th>
                    <th className={"text-center"}>Date d'envoi</th>
                    <th className={"text-center"}>Statut</th>
                    <th className={"text-center"}>Montant</th>
                    <th/>
                </tr>
                </thead>
                <tbody>
                {paginatedInvoices.map(invoice =>
                    <tr key={invoice.id}>
                        <td>{invoice.id}</td>
                        <td>
                            <a href={"#"}>{invoice.customer.firstName} {invoice.customer.lastName}</a>
                        </td>
                        <td className={"text-center"}> {formatDate(invoice.sentAt)}</td>
                        <td className={"text-center"}>
                            <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
                        </td>
                        <td className={"text-center"}>
                            {invoice.amount.toLocaleString()} €
                        </td>
                        <td>
                            <Link
                                className={"btn btn-sm btn-primary mr-1"}
                                to={"/invoices/" + invoice.id}
                            >
                                Editer
                            </Link>
                            <button
                                className={"btn btn-sm btn-danger"}
                                onClick={() => handleDelete(invoice.id)}
                            >
                                Supprimer
                            </button>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            {filteredInvoices.length > itemsPerPage &&
            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} onPageChange={handlePageChange} length={filteredInvoices.length} />
            }
        </Fragment>
    )
}