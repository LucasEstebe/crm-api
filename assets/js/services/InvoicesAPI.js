import axios from 'axios';

async function findAll(){
    return axios.get("http://127.0.0.1:8000/api/invoices")
        .then(response => response.data['hydra:member'])

}

async function find(id){
    return axios.get("http://127.0.0.1:8000/api/invoices/" +id)
        .then(response => response.data)
}

function create(invoice){
    return axios.post(
        "http://127.0.0.1:8000/api/invoices",
        {
            ...invoice,
            customer: `/api/customers/${invoice.customer}`
            }
        );
}

function update(id, invoice){
   return axios.put("http://127.0.0.1:8000/api/invoices" + id,
       {...invoice, customer: `/api/customers/${invoice.customer}`});
}

function deleteInvoice(id){
    return axios.delete("http://127.0.0.1:8000/api/invoices/"+ id)
}

export default {
    findAll,
    create,
    delete: deleteInvoice,
    update,
    find
};