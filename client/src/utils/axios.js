import axios from "axios";


const instance = axios.create({
  baseURL: "https://fullstack-realtime-chat-backend.onrender.com",
});


const token = localStorage.getItem("token");

if (token) {
  instance.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${token}`;
}


export default instance;