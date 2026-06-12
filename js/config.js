const API_URL = "http://127.0.0.1:8000/api";

function obtenerToken() {
    return localStorage.getItem("token");
}

function obtenerHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + obtenerToken()
    };
}