import axios from "axios";
import { apiUrl } from "../config.js";
import { getUserVotes } from "./userAPI.js";
import { getCurrentUser } from "./auth";

const apiEndpoint = apiUrl + "articles";

export function getArticles() {
  return axios.get(apiEndpoint).then((response) => {
    const data = response.data["hydra:member"];
    /*     const filter = data[4].votes.filter((a) => a.user.id == 1); */
    const user = getCurrentUser();
    data.map((item) => {
      if (user) {
        const filtered = item.votes.filter(
          (a) => a.user.username == user.username
        );
        item.votes = filtered;
      } else {
        item.votes = [];
      }
      return item;
    });
    console.log("getarticle", data);
    return data;
  });
}

export function getArticle(id) {
  return axios.get(apiEndpoint + "/" + id).then((response) => response.data);
}

export function updateArticle(id, component) {
  return axios
    .put(apiEndpoint + "/" + id, component, {
      headers: { "Content-type": "application/ld+json" },
    })
    .then((response) => response.data);
}

export function newArticle(component, file) {
  return axios.post(apiEndpoint, component).then((response) => {
    const responseId = response.data.id;

    if (file) {
      const fileData = new FormData();
      fileData.append("file", file);
      return axios.post(apiEndpoint + "/" + responseId + "/picture", fileData);
    }
  });
}

export function newArticlePicture(id, component) {
  return axios.post(apiEndpoint + "/" + id + "/picture", component);
}
export function deleteArticle(id) {
  return axios.delete(apiEndpoint + "/" + id);
}

export function getComments(id) {
  return axios
    .get(apiEndpoint + "/" + id + "/comments")
    .then((response) => response.data["hydra:member"]);
}
