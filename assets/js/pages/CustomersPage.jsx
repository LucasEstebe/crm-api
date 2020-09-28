import React, {Fragment, useEffect, useState} from 'react';
import axios from 'axios';

export const CustomersPage = (props) => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);


    useEffect(() =>{
        loadCustomers();
    }, [])

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
        axios.get("http://127.0.0.1:8000/api/customers")
            .then(response => response.data['hydra:member'])
            .then(data => setCustomers(data))
            .catch(error => console.log(error.response))
    }

    const itemsPerPage = 10;
    const pagesCount = Math.ceil(customers.length / itemsPerPage);
    const pages = [];

    for (let i = 1; i <= pagesCount; i++){
        pages.push(i);
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    //start + itemsPerPage
    const start = currentPage * itemsPerPage - itemsPerPage; // 3 * 10 - 10 = 20
    const paginatedCustomers = customers.slice(start, start + itemsPerPage)


    return (<Fragment>
        <h1>Liste des clients</h1>
        <table className={"table table-hover"}>
            <thead>
            <tr>
                <th>Id.</th>
                <th>Client</th>
                <th>Email</th>
                <th>Entreprise</th>
                <th className={"text-center"}>Factures</th>
                <th className={"text-center"}>Montant total</th>
                <th></th>
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
        <div>
            <ul className="pagination pagination-sm">
                <li className={"page-item" + (currentPage === 1 && " disabled")}>
                    <button className="page-link" onClick={() => handlePageChange(currentPage-1)}>&laquo;</button>
                </li>
                {pages.map(page =>
                    <li  key={page} className={"page-item" + (currentPage === page && " active")}>
                        <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
                    </li>
                )}
                <li className={"page-item" + (currentPage === pagesCount && " disabled")}>
                    <button className="page-link" onClick={() => handlePageChange(currentPage+1)}>&raquo;</button>
                </li>
            </ul>
        </div>
    </Fragment>);
}