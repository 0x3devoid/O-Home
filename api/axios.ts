import axios from 'axios'

const server = "https://edqorta.onrender.com/api";


export default axios.create({
  baseURL: server,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    "Accept": "application/json, text/plain, */*",
  },
});

