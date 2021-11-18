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
import ArticleListItem from "./ArticleListItem";

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

  useEffect(() => {}, [articles]);

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
    const datas = [...articles];
    const index = datas.indexOf(item);
    datas[index] = { ...datas[index] };
    const data = datas[index];

    if (!item.votes[0]) {
      handleNewScore(item, action, data, datas);
      handleSubmitNewScore(item, data, datas);
    } else {
      handleScore(item, action, data);
      handleSubmitScore(item, data, datas);
    }
  };

  const handleNewScore = (item, action, data) => {
    if (action === "-") {
      var down = true;
      var up = false;
      data.score -= 1;
      data.author.karma -= 1;
    } else {
      down = false;
      up = true;
      data.score += 1;
      data.author.karma += 1;
    }

    //Reformat
    const userId = user["@id"].slice(1);
    const articleId = item["@id"].slice(1);

    setAddVote({
      user: userId,
      article: articleId,
      isDown: down,
      isUp: up,
    });
    console.log(addVote);
  };

  const handleSubmitNewScore = async (item, data, datas) => {
    //Reformat
    data.author = data.author["@id"].slice(1);
    console.log(data);

    //Submit
    setArticlesChild(datas);
    try {
      await updateArticle(data.id, data);
      await updateUser(data.author.id, {
        karma: data.author.karma,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleScore = (item, action, data) => {
    if (action === "-") {
      if (!item.votes[0].isDown) {
        data.score -= 1;
        data.author.karma -= 1;
        item.votes[0].isDown = true;
        if (item.votes[0].isUp) {
          data.score -= 1;
          data.author.karma -= 1;
          item.votes[0].isUp = false;
        }
      } else {
        data.score += 1;
        data.author.karma += 1;
        item.votes[0].isDown = false;
      }
    } else {
      if (!item.votes[0].isUp) {
        data.score += 1;
        data.author.karma += 1;
        item.votes[0].isUp = true;
        if (item.votes[0].isDown) {
          data.score += 1;
          data.author.karma += 1;
          item.votes[0].isDown = false;
        }
      } else {
        data.score -= 1;
        data.author.karma -= 1;
        item.votes[0].isUp = false;
      }
    }
  };

  const handleSubmitScore = async (item, data, datas) => {
    //Reformat
    const voteData = { ...item.votes[0] };
    voteData.user = voteData.user["@id"].slice(1);

    //Submit
    setArticlesChild(datas);

    console.log("votes", voteData);
    try {
      await updateArticle(data.id, { score: data.score });
      await updateVote(item.votes[0].id, voteData);
      await updateUser(data.author.id, {
        karma: data.author.karma,
      });
    } catch (error) {
      console.log(error);
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
        <div className="row article mb-5">
          {articles.map((article) => (
            <ArticleListItem
              article={article}
              updateScore={updateScore}
              handleDelete={handleDelete}
              key={article.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleList;
