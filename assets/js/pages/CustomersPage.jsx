import React, {Fragment, useEffect, useState} from 'react';
import {Pagination} from "../components/Pagination";
import CustomersAPI from '../services/CustomersAPI';

export const CustomersPage = (props) => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    // Fetch all customers
    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);
        }catch(error){console.log(error.response)}
    }

    useEffect(() =>{
        fetchCustomers();
    }, [])

    // Gestion de ka supression d'un customer
    const handleDelete = async (id) => {
        const originalCustomers = [...customers];
        // 1. L'approche optimiste
        setCustomers(customers.filter(customer => customer.id !== id));
        // L'approche pessimiste
        try {
            await CustomersAPI.delete(id)
        } catch (error) {
            console.log(error.response);
            setCustomers(originalCustomers);
        }
    }

    const itemsPerPage = 10;


    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    //Gestion de la recherche
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    }

    // Filtrage de customers en fonction de la recherche
    const filteredCustomers = customers.filter(
        c =>
            c.firstName.toLowerCase().includes(search.toLowerCase()) ||
            c.lastName.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            (c.company && c.company.toLowerCase().includes(search.toLowerCase())
        )
    );

    // Pagination des données
    const paginatedCustomers = Pagination.getData(filteredCustomers, currentPage, itemsPerPage);

    return (<Fragment>
        <h1>Liste des clients</h1>

        <div className={"form-group"}>
            <input type={"text"} onChange={handleSearch} value={search} className={"form-control"} placeholder={"Rechercher..."}/>
        </div>

        <table className={"table table-hover"}>
            <thead>
            <tr>
                <th>Id.</th>
                <th>Client</th>
                <th>Email</th>
                <th>Entreprise</th>
                <th className={"text-center"}>Factures</th>
                <th className={"text-center"}>Montant total</th>
                <th/>
            </tr>
            </thead>
            <tbody>
            {paginatedCustomers.map(customer =>
                <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td>
                        <a href={"#"}>{customer.firstName} {customer.lastName}</a>
                    </td>
                    <td>{customer.email}</td>
                    <td>{customer.company}</td>
                    <td className={"text-center"}>
                        <span className={"badge badge-primary"}>{customer.invoices.length}</span>
                    </td>
                    <td className={"text-center"}>{customer.totalAmount.toLocaleString()} €</td>
                    <td>
                        <button
                            className={"btn btn-sm btn-danger"}
                            disabled={customer.invoices.length > 0}
                            onClick={() => handleDelete(customer.id)}
                        >
                            Supprimer
                        </button>
                    </td>
                </tr>
            )}
            </tbody>
        </table>
        {itemsPerPage < filteredCustomers.length &&
            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={filteredCustomers.length} onPageChange={handlePageChange}/>
        }
    </Fragment>);
}