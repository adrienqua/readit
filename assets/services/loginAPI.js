import axios from "axios";
import { apiUrl } from "../config.js";
import { newUser } from "./userAPI.js";

const apiEndpoint = apiUrl + "login";

export function login(component) {
  return axios.post(apiEndpoint, component).then((response) => {
    localStorage.setItem("token", response.data.token);
  });
}

export function logout() {
  localStorage.removeItem("token");
  window.location = "/";
}
