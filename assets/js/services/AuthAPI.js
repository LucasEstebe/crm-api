import axios from 'axios';
import jwtDecode from 'jwt-decode';

function isAuthenticated(){
    // Check if there is a token
    const token = window.localStorage.getItem("authToken");
    // Check if token has expired
    if (token){
        const {exp: expiration} = jwtDecode(token);
        if (expiration * 1000 > new Date().getTime()){
            return true;
        }
    }
    return false
}

function authenticate(credentials){
    return axios.post("http://127.0.0.1:8000/api/login_check", credentials)
        .then(response => response.data.token)
        .then(token =>{
            //Je stocke le token dans mon localStorage
            window.localStorage.setItem("authToken", token);
            // On previent axios qu'on a maintenan un header par défaut
            setAxiosToken(token);
        })
}

// Add token to axios default header
function setAxiosToken(token){
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}

// On page reload we add axios token if authenticated
function setup(){
    if (isAuthenticated()){setAxiosToken(window.localStorage.getItem("authToken"))}
}

// Remove token from local storage and axios header
function logout(){
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
}