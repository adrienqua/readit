import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Score from "../common/Score";
import {
  deleteArticle,
  updateArticle,
  getArticles,
} from "../services/articleAPI";
import { updateUser } from "../services/userAPI";
import { newVote, updateVote } from "../services/voteAPI";
import { toast } from "react-toastify";
import Modal from "./Modal";

const ArticleList = (props) => {
  const [addVote, setAddVote] = useState();
  const [karma, setKarma] = useState();

  useEffect(() => {
    if (addVote) {
      addNewVote();
      fetchArticle();
      console.log("ue addvote");
    }
  }, [addVote]);

  useEffect(() => {
    console.log("ue art");
  }, [articles]);

  const { articles, user, setArticlesChild, loaded } = props;

  const fetchArticle = async () => {
    try {
      setArticlesChild(await getArticles());
    } catch (error) {
      console.log(error);
    }
  };

  const addNewVote = async () => {
    try {
      await newVote(addVote);
    } catch (error) {
      console.log(error);
    }
  };

  const truncate = (str) => {
    return str.length > 200 ? str.substring(0, 200) + " ..." : str;
  };

  const handleDelete = async (art) => {
    const originalArticles = articles;
    const article = originalArticles.filter((a) => a.id != art.id);
    setArticlesChild(article);
    try {
      await deleteArticle(art.id);
      toast.success("Publication supprimée.");
    } catch (error) {
      console.log(error);
    }
  };

  const updateScore = async (item, action) => {
    if (!user.username) {
      props.history.push("/login");
    }
    const data = [...articles];
    const index = data.indexOf(item);
    data[index] = { ...data[index] };

    if (!item.votes[0]) {
      console.log("pas de score");
      const userId = user["@id"].slice(1);
      const articleId = item["@id"].slice(1);
      if (action === "-") {
        var down = true;
        var up = false;
        data[index].score -= 1;
      } else {
        down = false;
        up = true;
        data[index].score += 1;
      }
      data[index].author = data[index].author["@id"].slice(1);
      console.log(data[index]);
      setArticlesChild(data);
      await updateArticle(data[index].id, data[index]);
      /*       data[index] = await getArticle(data[index].id);
      setArticlesChild(data); */

      setAddVote({
        user: userId,
        article: articleId,
        isDown: down,
        isUp: up,
      });
      console.log(addVote);
    } else {
      if (action === "-") {
        if (!item.votes[0].isDown) {
          data[index].score -= 1;
          data[index].author.karma -= 1;
          item.votes[0].isDown = true;
          if (item.votes[0].isUp) {
            data[index].score -= 1;
            data[index].author.karma -= 1;
            item.votes[0].isUp = false;
          }
        } else {
          data[index].score += 1;
          data[index].author.karma += 1;
          item.votes[0].isDown = false;
        }
      } else {
        if (!item.votes[0].isUp) {
          data[index].score += 1;
          data[index].author.karma += 1;
          item.votes[0].isUp = true;
          if (item.votes[0].isDown) {
            data[index].score += 1;
            data[index].author.karma += 1;
            item.votes[0].isDown = false;
          }
        } else {
          data[index].score -= 1;
          data[index].author.karma -= 1;
          item.votes[0].isUp = false;
        }
      }

      const voteData = { ...item.votes[0] };
      voteData.user = voteData.user["@id"].slice(1);

      setArticlesChild(data);
      console.log("votes", voteData);
      try {
        await updateArticle(data[index].id, { score: data[index].score });
        await updateVote(item.votes[0].id, voteData);
        await updateUser(data[index].author.id, {
          karma: data[index].author.karma,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      {!loaded ? (
        <div className="row loading">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row article">
          {articles.map((article) => (
            <div
              className={`mb-1 g-0  row article-item item-${article.id}`}
              key={article.id}
            >
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
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleList;
