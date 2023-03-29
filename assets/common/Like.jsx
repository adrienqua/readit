import React from "react"

const Like = ({ onLike, liked, articleKey, article }) => {
    return (
        <button className="article-like btn btn-sm btn-light mx-1">
            <i
                className={liked ? "fa fa-heart" : "fa fa-heart-o"}
                onClick={
                    liked
                        ? () =>
                              onLike(article.id, "dislike", articleKey, article)
                        : () => onLike(article.id, "like", articleKey, article)
                }
                aria-hidden="true"
            ></i>
        </button>
    )
}

export default Like
