import React, { useContext, useEffect, useState } from "react"
import Input from "./Input"
import { AuthContext } from "../contexts/authContext"
import { updateComment, newComment } from "../services/commentAPI"
import { toast } from "react-toastify"

export default function CommentForm({
    handleChange,
    comment,
    type = "edit",
    fetchCommentsChilds,
    setIsReplying,
    setIsEditing,
}) {
    const [user, setUser] = useContext(AuthContext)

    const [newChildComment, setNewChildComment] = useState({
        author: user["@id"],
        parentId: comment.id,
        content: "",
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        e.target.reset()
        const content = {
            content: comment.content,
        }
        console.log("comment", comment)
        if (type === "edit") {
            await updateComment(comment.id, content)
            setIsEditing(false)
            toast.success("Commentaire modifié.")
        } else {
            await newComment(newChildComment)
            await fetchCommentsChilds()
            setNewChildComment((prevState) => ({
                ...prevState,
                content: "",
            }))
            setIsReplying(false)
            toast.success("Commentaire ajouté.")
        }
    }

    return (
        <div className="mt-3">
            <form onSubmit={handleSubmit}>
                <Input
                    name="content"
                    input="textarea"
                    label="Commentaire"
                    handleChange={
                        type === "edit"
                            ? (e) => handleChange(e, comment, type)
                            : (e) =>
                                  setNewChildComment((prevState) => ({
                                      ...prevState,
                                      content: e.target.value,
                                  }))
                    }
                    value={type === "edit" ? comment.content : newChildComment.content}
                    required="required"
                    minLength={3}
                ></Input>
                <button type="submit" className="btn btn-primary mb-3">
                    Valider
                </button>
            </form>
        </div>
    )
}
