import React, { useState, useEffect, useContext } from "react"
import { useHistory } from "react-router-dom"
import {
    deleteComment,
    newComment,
    updateComment,
} from "../services/commentAPI"
import { toast } from "react-toastify"
import CommentItem from "./CommentItem"
import { handleNewScore } from "../scripts/score"
import { handleScore } from "./../scripts/score"
import { AuthContext } from "../contexts/authContext"
import { newVote, updateVote } from "../services/voteAPI"
import { updateUser } from "../services/userAPI"
import Loader from "./Loader"

const Comments = (props) => {
    const [addComment, setAddComment] = useState({
        content: "ok",
        article: "",
    })

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

    const handleEditChange = (e, data) => {
        const comment = [...comments]
        const index = comment.indexOf(data)
        comment[index] = { ...comment[index] }
        comment[index].content = e.target.value

        setComments(comment)
    }

    const handleDelete = async (data) => {
        const ogComment = comments
        const comment = ogComment.filter((c) => c.id != data.id)
        setComments(comment)

        try {
            deleteComment(data.id)
            toast.success("Commentaire supprimé !")
        } catch (error) {
            console.log(error)
        }
    }

    const isEdit = (data) => {
        const comment = [...comments]
        const index = comment.indexOf(data)
        comment[index] = { ...comment[index] }
        comment[index].editMode = true
        setComments(comment)
        console.log(comments)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        e.target.reset()

        await newComment(addComment)
        await fetchComments()
        toast.success("Commentaire ajouté.")
    }

    const handleEditSubmit = async (data) => {
        const content = {
            content: data.content,
        }
        console.log("data", data)
        await updateComment(data.id, content)
        await fetchComments()
        toast.success("Commentaire modifié.")
    }

    const updateScore = async (item, action) => {
        if (!user.username) {
            history.push("/login")
        }

        //check if the user got a vote from this comment
        const findScore = user?.votes?.some(
            (vote) => item.votes.map((v) => v["@id"]).indexOf(vote) >= 0
        )

        const datas = [...comments]
        const index = datas.indexOf(item)
        datas[index] = { ...datas[index] }
        const data = datas[index]

        if (!findScore) {
            console.log("New vote !")
            handleNewScore(action, data)
            handleSubmitNewScore(item, data, datas)
            console.log("user ue", user, item, findScore)
        } else {
            console.log("update vote !")
            handleScore(item, action, data)
            handleSubmitScore(item, data, datas)
        }
    }

    const handleSubmitNewScore = async (item, data, datas) => {
        //Reformat
        const userId = user["@id"]
        const commentId = item["@id"]
        const author = data.author
        console.log(data)

        //Submit
        try {
            await newVote({
                user: userId,
                comment: commentId,
                isDown: data.down,
                isUp: data.up,
            }).then((response) => {
                //setUser
                const newVoteId = response.data.id
                const userNewVotes = [...user.votes]
                userNewVotes.push(`/api/votes/${newVoteId}`)
                setUser((prevState) => ({
                    ...prevState,
                    votes: userNewVotes,
                }))
                if (user.id === data.author.id) {
                    setUser((prevState) => ({
                        ...prevState,
                        karma: data.author.karma,
                    }))
                }

                //setComments
                const newVote = {
                    ["@id"]: `/api/votes/${newVoteId}`,
                    id: newVoteId,
                    isUp: response.data.isUp,
                    isDown: response.data.isDown,
                    user: {
                        ["@id"]: userId,
                    },
                }
                data.votes.push(newVote)
                setComments(datas)
            })
            await updateComment(data.id, { score: data.score })
            await updateUser(author.id, {
                karma: author.karma,
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmitScore = async (item, data, datas) => {
        //Reformat
        const voteData = { ...item.votes[0] }
        voteData.user = voteData.user["@id"]

        //Submit
        //console.log("submit datas", datas)
        setComments(datas)
        if (user.id === data.author.id) {
            setUser((prevState) => ({
                ...prevState,
                karma: data.author.karma,
            }))
        }

        console.log("votes", voteData)
        try {
            await updateComment(data.id, { score: data.score })
            await updateVote(item.votes[0].id, voteData)
            await updateUser(data.author.id, {
                karma: data.author.karma,
            })
        } catch (error) {
            console.log(error)
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
                            <input
                                className="btn btn-primary mt-1"
                                type="submit"
                                value="Envoyer"
                            />
                        </form>
                    </div>
                </div>
            </div>

            <div className="card my-4 col-md-8 offset-md-2 p-3">
                <div className="card-body">
                    <h2 className="card-title ">
                        <i
                            className="fa fa-comments mb-3"
                            aria-hidden="true"
                        ></i>{" "}
                        Commentaires
                    </h2>
                    {!loaded ? (
                        <Loader />
                    ) : (
                        <div className="row comment-list px-2">
                            {comments.map((comment) => (
                                <CommentItem
                                    comment={comment}
                                    key={comment.id}
                                    isEdit={isEdit}
                                    handleDelete={handleDelete}
                                    handleEditChange={handleEditChange}
                                    handleEditSubmit={handleEditSubmit}
                                    updateScore={updateScore}
                                    user={user}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </React.Fragment>
    )
}

export default Comments
