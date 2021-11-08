import axios from "axios";
import { apiUrl } from "../config.js";

const apiEndpoint = apiUrl + "votes";

export function newVote(component) {
  return axios.post(apiEndpoint, component);
}

export function updateVote(id, component) {
  return axios
    .put(apiEndpoint + "/" + id, component, {
      headers: { "Content-type": "application/ld+json" },
    })
    .then((response) => response.data);
}
