import axios from "axios"
import { apiUrl } from "../config.js"

const apiEndpoint = apiUrl + "favorites"

export function newFavorite(component) {
    return axios.post(apiEndpoint, component)
}

export function updateFavorite(id, component) {
    return axios
        .put(apiEndpoint + "/" + id, component, {
            headers: { "Content-type": "application/ld+json" },
        })
        .then((response) => response.data)
}
