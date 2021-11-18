import axios from "axios";
import { apiUrl } from "../config.js";
import { getUserVotes } from "./userAPI.js";
import { getCurrentUser } from "./auth";
import { newVote } from "../services/voteAPI";

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
    return data.reverse();
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
    const articleId = response.data["@id"].slice(1);
    const userId = response.data.author["@id"].slice(1);
    newVote({
      user: userId,
      article: articleId,
      isUp: true,
    });
    if (file) {
      const responseId = response.data.id;
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
