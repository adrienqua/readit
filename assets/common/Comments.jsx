import React, { useState, useEffect } from "react";
import { getArticle, getComments } from "../services/articleAPI";
import {
  deleteComment,
  newComment,
  updateComment,
} from "../services/commentAPI";
import { toast } from "react-toastify";
import Input from "./Input";
import Modal from "./Modal";
const Comments = (props) => {
  const [addComment, setAddComment] = useState({
    content: "ok",
    article: "",
  });

  const { comments, date, article, user, fetchComments, loaded, setComments } =
    props;

  useEffect(() => {}, []);

  const handleChange = (e) => {
    const articleId = article["@id"].slice(1);
    const userId = user["@id"].slice(1);

    setAddComment({
      ...addComment,
      [e.target.name]: e.target.value,
      article: articleId,
      author: userId,
    });
  };

  const handleEditChange = (e, data) => {
    const comment = [...comments];
    const index = comment.indexOf(data);
    comment[index] = { ...comment[index] };
    comment[index].content = e.target.value;

    setComments(comment);
  };
  const handleDelete = async (data) => {
    const ogComment = comments;
    const comment = ogComment.filter((c) => c.id != data.id);
    setComments(comment);

    try {
      deleteComment(data.id);
      toast.success("Commentaire supprimé !");
    } catch (error) {
      console.log(error);
    }
  };

  const isEdit = (data) => {
    const comment = [...comments];
    const index = comment.indexOf(data);
    comment[index] = { ...comment[index] };
    comment[index].editMode = true;
    setComments(comment);
    console.log(comments);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.target.reset();

    await newComment(addComment);
    await fetchComments();
    toast.success("Commentaire ajouté.");
  };
  const handleEditSubmit = async (data) => {
    const content = {
      content: data.content,
    };
    console.log("data", data);
    await updateComment(data.id, content);
    await fetchComments();
    toast.success("Commentaire modifié.");
  };

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
            <i className="fa fa-comments mb-3" aria-hidden="true"></i>{" "}
            Commentaires
          </h2>
          {!loaded ? (
            <div className="row loading">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row comment-list px-2">
              {comments.map((comment) => (
                <div className="comment-item mb-2" key={comment.id}>
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
                          className="btn btn-secondary p-0 mx-1"
                          data-bs-toggle="modal"
                          data-bs-target={`#confirmationModal${comment.id}`}
                        >
                          <i className="fa fa-fw fa-times"></i>
                        </button>

                        <Modal
                          id={comment.id}
                          handleDelete={() => handleDelete(comment)}
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
              ))}
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Comments;
