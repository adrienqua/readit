import React from "react"
import Input from "./Input"
import Modal from "./Modal"

const CommentItem = (props) => {
    const {
        comment,
        isEdit,
        date,
        handleDelete,
        handleEditChange,
        handleEditSubmit,
        user,
    } = props

    return (
        <React.Fragment>
            <div className="comment-item mb-2">
                <div className="comment-header d-flex">
                    <span className="comment-author me-auto">
                        {comment.author.username}{" "}
                        <small className="comment-date text-muted">
                            le {date(comment.createdAt)}{" "}
                        </small>
                    </span>
                    {comment.author.id === user.id && (
                        <span className="comment-actions">
                            <button
                                className="btn btn-light p-0 mx-1"
                                onClick={() => isEdit(comment)}
                            >
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

                {!comment.editMode ? (
                    <p className="comment-content">{comment.content}</p>
                ) : (
                    <div>
                        <Input
                            name="content"
                            label="Commentaire"
                            handleChange={(e) => handleEditChange(e, comment)}
                            value={comment.content}
                        ></Input>
                        <button
                            className="btn btn-primary mb-3"
                            onClick={() => handleEditSubmit(comment)}
                        >
                            Valider
                        </button>
                    </div>
                )}
            </div>
        </React.Fragment>
    )
}

export default CommentItem
