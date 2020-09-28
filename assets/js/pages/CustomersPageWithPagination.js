import React, {Fragment, useEffect, useState} from 'react';
import axios from 'axios';
import {Pagination} from "../components/Pagination";

export const CustomersPageWithPagination = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [totalItems, setTotalItems] = useState(0)
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;


    useEffect(() =>{
        loadCustomers();
    }, [currentPage])

    const handleDelete = (id) => {
        const originalCustomers = [...customers];

        // 1. L'approche optimiste
        setCustomers(customers.filter(customer => customer.id !== id));

        // L'approche pessimiste
        axios.delete("http://127.0.0.1:8000/api/customers/" + id)
            .then(response => console.log("ok"))
            .catch(error => {
                console.log(error.response);
                setCustomers(originalCustomers);
            })
    }

    const loadCustomers = () => {
        axios.get(`http://127.0.0.1:8000/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`)
            .then(response => {
                setCustomers(response.data['hydra:member']);
                setTotalItems(response.data['hydra:totalItems']);
                setIsLoading(false);
            })
            .catch(error => console.log(error.response))
    }




    const handlePageChange = (page) => {
        setIsLoading(true);
        setCurrentPage(page);
    }


    const paginatedCustomers = Pagination.getData(customers, currentPage, itemsPerPage);

    return (<Fragment>
        <h1>Liste des clients (Pagination)</h1>
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
            {isLoading && (<tr><td>Loading...</td></tr>)}
            {!isLoading && customers.map(customer =>
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
        <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={totalItems} onPageChange={handlePageChange}/>
    </Fragment>);
}