import axios from "axios"
import { apiUrl } from "../config.js"
import { getCurrentUser } from "./auth.js"

const apiEndpoint = apiUrl + "comments"

export function newComment(component) {
    return axios.post(apiEndpoint, component)
}

export function updateComment(id, component) {
    return axios
        .put(apiEndpoint + "/" + id, component, {
            headers: { "Content-type": "application/ld+json" },
        })
        .then((response) => response.data)
}

export function deleteComment(id) {
    return axios.delete(apiEndpoint + "/" + id)
}

export function getCommentChilds(parentId) {
    return axios.get(`${apiEndpoint}?parentId=${parentId}`).then((res) => {
        const data = res.data["hydra:member"].reverse()

        const user = getCurrentUser()
        data.map((item) => {
            if (user) {
                const filtered = item.votes?.filter((a) => a.user?.username == user.username)
                item.votes = filtered
            } else {
                item.votes = []
            }
            return item
        })
        return data
    })
}
