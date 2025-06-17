import axios from "axios";


const productionServer = "https://capy-db.onrender.com/api/v1";
const local = "http://localhost:5050/api/v1"
const ProductBackup = "https://capy-db-emnm.onrender.com/api/v1"


export default axios.create({
  baseURL: ProductBackup,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    "Accept": "application/json, text/plain, */*",
  },
});
