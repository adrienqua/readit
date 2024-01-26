import React, { useContext, useEffect, useState } from "react"
import CommentItem from "./CommentItem"
import { handleNewScore, handleScore, handleSubmitNewScore, handleSubmitScore } from "../scripts/score"
import { AuthContext } from "../contexts/authContext"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

export default function CommentList({ comments, article, handleEditSubmit, fetchComments, isLoaded, setIsLoaded }) {
    const [commentList, setCommentList] = useState(comments)

    const [user, setUser] = useContext(AuthContext)

    const history = useHistory()

    const handleDelete = async (data) => {
        const ogComment = comments
        const comment = ogComment.filter((c) => c.id != data.id)
        setCommentList(comment)

        try {
            deleteComment(data.id)
            toast.success("Commentaire supprimé !")
        } catch (error) {
            console.log(error)
        }
    }

    const handleEditChange = (e, data, type) => {
        const comment = [...comments]
        const index = comment.indexOf(data)
        comment[index] = { ...comment[index] }
        comment[index].content = e.target.value

        if (type === "replying") {
            comment.parentId = comment.id
        }

        setCommentList(comment)
    }

    const updateScore = async (item, action) => {
        if (!user.username) {
            history.push("/login")
        }

        //check if the user got a vote from this comment
        const findScore = user?.votes?.some((vote) => item.votes.map((v) => v["@id"]).indexOf(vote) >= 0)

        const datas = [...commentList]
        const index = datas.indexOf(item)
        datas[index] = { ...datas[index] }
        const data = datas[index]

        if (!findScore) {
            console.log("New vote !")
            handleNewScore(action, data)
            handleSubmitNewScore(data, datas, setCommentList, user, setUser, "comment")
            console.log("user ue", user, item, findScore)
        } else {
            console.log("update vote !")
            handleScore(item, action, data)
            handleSubmitScore(data, datas, setCommentList, user, setUser, "comment")
        }
    }

    useEffect(() => {
        setCommentList(comments)
    }, [comments])

    return (
        <>
            {commentList.map((comment) => (
                <CommentItem
                    comment={comment}
                    comments={comments}
                    setCommentList={setCommentList}
                    article={article}
                    key={comment.id}
                    handleDelete={handleDelete}
                    handleEditChange={handleEditChange}
                    handleEditSubmit={handleEditSubmit}
                    updateScore={updateScore}
                    user={user}
                    fetchComments={fetchComments}
                />
            ))}
        </>
    )
}
