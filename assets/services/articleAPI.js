import axios from "axios"
import { apiUrl } from "../config.js"
import { newVote } from "../services/voteAPI"
import { getCurrentUser } from "./auth"

const apiEndpoint = apiUrl + "articles"

export function getArticles(page) {
    return axios.get(apiEndpoint + "?page=" + page).then((response) => {
        const data = response.data["hydra:member"]
        const user = getCurrentUser()
        data.map((item) => {
            if (user) {
                const filtered = item.votes.filter(
                    (a) => a.user?.username == user.username
                )
                item.votes = filtered
            } else {
                item.votes = []
            }
            return item
        })
        return data
    })
}

export function getArticle(id) {
    return axios.get(apiEndpoint + "/" + id).then((response) => {
        const data = response.data
        const user = getCurrentUser()
        data.comments.map((item) => {
            if (user) {
                const filtered = item.votes?.filter(
                    (a) => a.user?.username == user.username
                )
                item.votes = filtered
            } else {
                item.votes = []
            }
        })
        return data
    })
}

export function updateArticle(id, component) {
    return axios
        .put(apiEndpoint + "/" + id, component, {
            headers: { "Content-type": "application/ld+json" },
        })
        .then((response) => response.data)
}

export function newArticle(component) {
    return axios.post(apiEndpoint, component)
}

export function newArticlePicture(id, component) {
    return axios.post(apiEndpoint + "/" + id + "/picture", component)
}
export function deleteArticle(id) {
    return axios.delete(apiEndpoint + "/" + id)
}

export function getComments(id) {
    return axios
        .get(apiEndpoint + "/" + id + "/comments")
        .then((response) => response.data["hydra:member"])
}

export function getFavoritesArticles(user, page) {
    return axios
        .get(apiEndpoint + "?favorites.user.id=" + user + "&page=" + page)
        .then((response) => response.data["hydra:member"])
}
