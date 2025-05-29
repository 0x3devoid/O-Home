import axios from "axios";


const productionServer = "https://capy-db.onrender.com/api/v1";


export default axios.create({
  baseURL: productionServer,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    "Accept": "application/json, text/plain, */*",
  },
});
