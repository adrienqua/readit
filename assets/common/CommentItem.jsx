import React, { useEffect, useState } from "react"
import { formatDate } from "../scripts/formatDate"
import Modal from "./Modal"
import Score from "./Score"
import { Link } from "react-router-dom"
import CommentForm from "./CommentForm"
import { getCommentChilds } from "../services/commentAPI"
import CommentList from "./CommentList"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

const CommentItem = (props) => {
    const {
        comment,
        handleDelete,
        handleEditChange,
        handleEditSubmit,
        updateScore,
        user,
        fetchComments,
        setCommentList,
        comments,
        article,
    } = props

    const [isReplying, setIsReplying] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    const history = useHistory()

    const handleReply = () => {
        if (!user.username) {
            history.push("/login")
        }

        setIsReplying(!isReplying)
    }

    const fetchCommentsChilds = async () => {
        const datas = await getCommentChilds(comment.id)

        const commentsClone = [...comments]
        const index = commentsClone.indexOf(comment)
        commentsClone[index].subcomments = datas
        setCommentList(commentsClone)
    }

    useEffect(() => {
        fetchCommentsChilds()
    }, [])

    return (
        <React.Fragment>
            <div className="comment-item d-flex mb-2">
                <Score data={comment} updateScore={updateScore} />

                <div className="comment-item-container ps-3">
                    <div className="comment-header d-flex">
                        <span className="comment-author me-auto">
                            <Link to={`/user/${comment.author.username}`}>{comment.author.username} </Link>

                            <small className="comment-date text-muted">le {formatDate(comment.createdAt)} </small>
                        </span>
                        {comment.author.id === user.id && (
                            <span className="comment-actions">
                                <button className="btn btn-light p-0 mx-1" onClick={() => setIsEditing(!isEditing)}>
                                    <i className="fa fa-fw fa-pencil"></i>
                                </button>
                                <button
                                    className="btn btn-light p-0 mx-1"
                                    data-bs-toggle="modal"
                                    data-bs-target={`#deleteArticleCommentModal${comment.id}`}
                                >
                                    <i className="fa fa-fw fa-times"></i>
                                </button>

                                <Modal
                                    id={`deleteArticleCommentModal${comment.id}`}
                                    handleSubmit={() => handleDelete(comment)}
                                    action="Supprimer"
                                    title="Supprimer le commentaire."
                                    content="Voulez vous vraiment supprimer votre commentaire ?"
                                />
                            </span>
                        )}
                    </div>

                    {!isEditing ? (
                        <>
                            <p className="comment-content">{comment.content}</p>
                            <div>
                                <button onClick={() => handleReply()} className="btn btn-light btn-sm mb-4">
                                    <i className="fa fa-comment-o"></i>
                                    <span className="ps-2">Répondre</span>
                                </button>
                                {isReplying && (
                                    <CommentForm
                                        comment={comment}
                                        handleChange={handleEditChange}
                                        handleSubmit={handleEditSubmit}
                                        type="replying"
                                        fetchCommentsChilds={fetchCommentsChilds}
                                        setIsReplying={setIsReplying}
                                    />
                                )}
                            </div>
                        </>
                    ) : (
                        <CommentForm comment={comment} handleChange={handleEditChange} setIsEditing={setIsEditing} />
                    )}

                    {comment.subcomments && comment.subcomments.length > 0 && (
                        <CommentList
                            comments={comment.subcomments}
                            article={article}
                            handleDelete={handleDelete}
                            handleEditChange={handleEditChange}
                            handleEditSubmit={handleEditSubmit}
                            updateScore={updateScore}
                            fetchComments={fetchComments}
                        />
                    )}
                </div>
            </div>
        </React.Fragment>
    )
}

export default CommentItem
