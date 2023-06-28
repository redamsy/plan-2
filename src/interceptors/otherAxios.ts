import axios from "axios";

const otherAxios = axios.create();
otherAxios.defaults.headers.common["Authorization"] =
  "Bearer " + localStorage.getItem("access_token") || "";
otherAxios.defaults.headers.common["Accept"] = "application/json";

export default otherAxios;
