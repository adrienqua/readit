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
import CommentItem from "./CommentItem";
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
                <CommentItem
                  comment={comment}
                  key={comment.id}
                  date={date}
                  isEdit={isEdit}
                  handleDelete={handleDelete}
                  handleEditChange={handleEditChange}
                  handleEditSubmit={handleEditSubmit}
                  user={user}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Comments;
