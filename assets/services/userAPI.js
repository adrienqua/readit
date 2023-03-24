import axios from "axios"
import { apiUrl } from "../config.js"
import { login } from "./loginAPI.js"

const apiEndpoint = apiUrl + "users"

export function newUser(component) {
    return axios.post(apiEndpoint, component).then((response) => {
        const loginData = {
            username: component.username,
            password: component.password,
        }
        return login(loginData)
    })
}

export function getUserWithUsername(username) {
    return axios
        .get(apiEndpoint + "?username=" + username)
        .then((response) => response.data["hydra:member"][0])
}

export function updateUser(id, component) {
    return axios
        .put(apiEndpoint + "/" + id, component, {
            headers: { "Content-type": "application/ld+json" },
        })
        .then((response) => response.data)
}

export function getArticleVotes(id, articleId) {
    return axios
        .get(apiEndpoint + "/" + id + "/articles/" + articleId + "/votes")
        .then((response) => response.data["hydra:member"][0])
}

export function getUserArticles(id, page) {
    return axios
        .get(apiEndpoint + "/" + id + "/articles" + "?page=" + page)
        .then((response) => response.data["hydra:member"])
}
