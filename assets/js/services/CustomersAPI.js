import axios from 'axios';

async function findAll(){
    return axios.get("http://127.0.0.1:8000/api/customers")
        .then(response => response.data['hydra:member'])

}

function deleteCustomer(id){
    return
}

export default {
    findAll,
    delete: deleteCustomer
};