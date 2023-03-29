import React, { useState, useEffect, useRef, useContext } from "react"
import { Link } from "react-router-dom"
import Score from "../common/Score"
import Modal from "./Modal"
import Like from "./Like"
import ArticleEdit from "./../pages/ArticleEdit"
import { AuthContext } from "./../contexts/authContext"

const ArticleListItem = (props) => {
    const {
        article,
        articles,
        setArticles,
        updateScore,
        handleDelete,
        handleLike,
        articleKey,
    } = props

    const [liked, setLiked] = useState(false)

    const user = useContext(AuthContext)

    const editFormRef = useRef(null)

    useEffect(() => {
        const findFavorites = user?.favorites?.some(
            (fav) => article.favorites.indexOf(fav) >= 0
        )
        setLiked(findFavorites)
    }, [articles, user])

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
                    <Like
                        onLike={handleLike}
                        liked={liked}
                        articleKey={articleKey}
                        article={article}
                    />
                    {user.id === article.author.id && (
                        <>
                            {/*                             <Link to={`/articles/${article.id}/edit`}>
                                <button className="btn btn-sm btn-light mx-1">
                                    <i
                                        className="fa fa-pencil"
                                        aria-hidden="true"
                                    ></i>
                                </button>
                            </Link> */}
                            <button
                                className="btn btn-sm btn-light mx-1"
                                data-bs-toggle="modal"
                                data-bs-target={`#editArticleModal${article.id}`}
                            >
                                <i
                                    className="fa fa-pencil"
                                    aria-hidden="true"
                                ></i>
                            </button>
                            <button
                                className="btn btn-sm btn-light mx-1"
                                data-bs-toggle="modal"
                                data-bs-target={`#deleteArticleModal${article.id}`}
                            >
                                <i
                                    className="fa fa-trash-o"
                                    aria-hidden="true"
                                ></i>
                            </button>
                            <Modal
                                id={`editArticleModal${article.id}`}
                                handleSubmit={() => editFormRef.current.click()}
                                action="Editer"
                                title={`Editer l'article ${article.id}`}
                                content={
                                    <ArticleEdit
                                        id={article.id}
                                        submitRef={editFormRef}
                                        setArticles={setArticles}
                                        articles={articles}
                                    />
                                }
                            />
                            <Modal
                                id={`deleteArticleModal${article.id}`}
                                handleSubmit={() => handleDelete(article)}
                                action="Supprimer"
                                title="Supprimer l'article."
                                content="Voulez vous vraiment supprimer votre article ?"
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ArticleListItem
