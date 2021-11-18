import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Score from "../common/Score";
import Modal from "./Modal";

const ArticleListItem = (props) => {
  const { article, updateScore, handleDelete } = props;

  return (
    <div className={`mb-1 g-0  row article-item item-${article.id}`}>
      <Score data={article} updateScore={updateScore} />
      <div className="col-auto article-picture  p-2">
        {article.picture ? (
          <img
            src={`/image/article/${article.picture}`}
            alt={article.picture}
            className=" rounded"
          />
        ) : (
          <i className="fa fa-file-image-o" aria-hidden="true"></i>
        )}
      </div>
      <div className="col-auto p-2">
        {article.tags.map((tag) => (
          <Link
            to={`/tag/${tag.label}`}
            key={tag.id}
            className="article-tag badge bg-secondary mx-1"
          >
            {tag.label}
          </Link>
        ))}
        <span className="title d-inline-block px-2">
          <Link to={`/article/${article.id}`}>
            <h3 className="m-0"> {article.title}</h3>
          </Link>
          <span>{article.publishedAt}</span>
        </span>
        <p className="article-author">
          <small className="text-muted">
            {" "}
            publié par{" "}
            <Link to={`/user/${article.author.username}`}>
              {article.author.username}
            </Link>
          </small>
        </p>

        <span className="">
          <button
            className="btn btn-danger mx-1"
            data-bs-toggle="modal"
            data-bs-target={`#confirmationModal${article.id}`}
          >
            <i className="fa fa-trash-o" aria-hidden="true"></i>
          </button>
          <Modal
            id={article.id}
            handleDelete={() => handleDelete(article)}
            title="Supprimer l'article."
            content="Voulez vous vraiment supprimer votre article ?"
          />
          <Link to={`/articles/${article.id}/edit`}>
            <button className="btn btn-light mx-1">
              <i className="fa fa-pencil" aria-hidden="true"></i>
            </button>
          </Link>
        </span>
      </div>
    </div>
  );
};

export default ArticleListItem;
