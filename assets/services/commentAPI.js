import axios from "axios";
import { apiUrl } from "../config.js";

const apiEndpoint = apiUrl + "comments";

export function newComment(component) {
  return axios.post(apiEndpoint, component);
}

export function updateComment(id, component) {
  return axios
    .put(apiEndpoint + "/" + id, component, {
      headers: { "Content-type": "application/ld+json" },
    })
    .then((response) => response.data);
}

export function deleteComment(id) {
  return axios.delete(apiEndpoint + "/" + id);
}
