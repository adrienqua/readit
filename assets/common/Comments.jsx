import React, { useState, useEffect, useContext } from "react"
import { useHistory } from "react-router-dom"
import { getCommentChilds, newComment, updateComment } from "../services/commentAPI"
import { toast } from "react-toastify"
import { AuthContext } from "../contexts/authContext"
import Loader from "./Loader"
import CommentList from "./CommentList"

const Comments = (props) => {
    const [addComment, setAddComment] = useState({
        content: "ok",
        article: "",
    })
    const [isLoaded, setIsLoaded] = useState(false)

    const { comments, article, fetchComments, loaded, setComments } = props

    const [user, setUser] = useContext(AuthContext)

    const history = useHistory()

    useEffect(() => {}, [])

    const handleChange = (e) => {
        const articleId = article["@id"]
        const userId = user["@id"]

        setAddComment({
            ...addComment,
            [e.target.name]: e.target.value,
            article: articleId,
            author: userId,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        e.target.reset()

        await newComment(addComment)
        await fetchComments()
        toast.success("Commentaire ajouté.")
    }

    const handleEditSubmit = async (e, data, type) => {
        e.preventDefault()
        e.target.reset()
        const content = {
            content: data.content,
        }
        console.log("data", data)
        if (type === "edit") {
            await updateComment(data.id, content)
            toast.success("Commentaire modifié.")
        } else {
            await newComment(data)
            await getCommentChilds(data.parentId)
            toast.success("Commentaire ajouté.")
        }
    }

    return (
        <React.Fragment>
            <div className="card mt-4 col-md-8 offset-md-2 p-3">
                <div className="card-body">
                    <div className="comment-form">
                        <form onSubmit={handleSubmit}>
                            <div className="form-floating mb-3">
                                <textarea
                                    className="form-control"
                                    name="content"
                                    placeholder=" "
                                    value={newComment.content}
                                    onChange={(e) => handleChange(e)}
                                    rows="5"
                                    required="required"
                                    minLength={3}
                                />
                                <label>Commenter</label>
                            </div>
                            <input className="btn btn-primary mt-1" type="submit" value="Envoyer" />
                        </form>
                    </div>
                </div>
            </div>

            <div className="card my-4 col-md-8 offset-md-2 p-3">
                <div className="card-body">
                    <h2 className="card-title ">
                        <i className="fa fa-comments mb-3" aria-hidden="true"></i> Commentaires
                    </h2>
                    {!loaded ? (
                        <Loader />
                    ) : (
                        <div className="row comment-list px-2">
                            <CommentList
                                comments={comments}
                                setComments={setComments}
                                article={article}
                                handleEditSubmit={handleEditSubmit}
                                user={user}
                                fetchComments={fetchComments}
                                isLoaded={isLoaded}
                                setIsLoaded={setIsLoaded}
                            />
                        </div>
                    )}
                </div>
            </div>
        </React.Fragment>
    )
}

export default Comments
