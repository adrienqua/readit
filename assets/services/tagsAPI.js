import axios from "axios";
import { apiUrl } from "../config.js";

const apiEndpoint = apiUrl + "tags";

export function getTags() {
  return axios
    .get(apiEndpoint)
    .then((response) => response.data["hydra:member"]);
}

export function getTag(id) {
  return axios.get(apiEndpoint + "/" + id).then((response) => response.data);
}

export function getTagWithLabel(label) {
  return axios
    .get(apiEndpoint + "?label=" + label)
    .then((response) => response.data["hydra:member"][0]);
}

export function getTagArticles(id) {
  return axios
    .get(apiEndpoint + "/" + id + "/articles")
    .then((response) => response.data["hydra:member"]);
}
