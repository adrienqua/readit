import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Score from "../common/Score"
import Modal from "./Modal"

const ArticleListItem = (props) => {
    const {
        article,
        articles,
        updateScore,
        handleDelete,
        user,
        onLike,
        articleKey,
    } = props
    const [liked, setLiked] = useState(false)

    useEffect(() => {
        const findFavorites = article.author.favorites.some(
            (fav) => article.favorites.indexOf(fav) >= 0
        )
        setLiked(findFavorites)
    }, [articles])

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
            <div className="article-item-content col-auto p-2">
                <div className="article-categories">
                    {article.tags.map((tag) => (
                        <Link
                            to={`/tag/${tag.label}`}
                            key={tag.id}
                            className="article-category badge rounded-pill bg-secondary ms-2"
                        >
                            {tag.label}
                        </Link>
                    ))}
                </div>
                <span className="title d-inline-block px-2">
                    <Link to={`/article/${article.id}`}>
                        <h3 className="m-0"> {article.title}</h3>
                    </Link>
                    <span>{article.publishedAt}</span>
                </span>
                <p className="article-author px-2">
                    <small className="text-muted">
                        {" "}
                        publié par{" "}
                        <Link to={`/user/${article.author.username}`}>
                            {article.author.username}
                        </Link>
                    </small>
                </p>
                <div>
                    <Link to={`/article/${article.id}`}>
                        <span className="btn btn-sm btn-light ms-2 me-1">
                            <i className="fa fa-comments"></i>{" "}
                            <small>
                                {article.comments.length
                                    ? article.comments.length
                                    : "0"}{" "}
                            </small>
                        </span>
                    </Link>
                    <button className="article-like btn btn-sm btn-light mx-1">
                        <i
                            className={liked ? "fa fa-heart" : "fa fa-heart-o"}
                            onClick={
                                liked
                                    ? () =>
                                          onLike(
                                              article.id,
                                              "dislike",
                                              articleKey,
                                              article
                                          )
                                    : () =>
                                          onLike(
                                              article.id,
                                              "like",
                                              articleKey,
                                              article
                                          )
                            }
                            aria-hidden="true"
                        ></i>
                    </button>
                    {user.id === article.author.id && (
                        <>
                            <Link to={`/articles/${article.id}/edit`}>
                                <button className="btn btn-sm btn-light mx-1">
                                    <i
                                        className="fa fa-pencil"
                                        aria-hidden="true"
                                    ></i>
                                </button>
                            </Link>
                            <button
                                className="btn btn-sm btn-light mx-1"
                                data-bs-toggle="modal"
                                data-bs-target={`#confirmationModal${article.id}`}
                            >
                                <i
                                    className="fa fa-trash-o"
                                    aria-hidden="true"
                                ></i>
                            </button>
                        </>
                    )}
                    <Modal
                        id={article.id}
                        handleDelete={() => handleDelete(article)}
                        title="Supprimer l'article."
                        content="Voulez vous vraiment supprimer votre article ?"
                    />
                </div>
            </div>
        </div>
    )
}

export default ArticleListItem
