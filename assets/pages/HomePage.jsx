import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import ArticleList from "../common/ArticleList";
import {
  getArticles,
  deleteArticle,
  updateArticle,
} from "../services/articleAPI";

import { newVote, updateVote } from "../services/voteAPI";
import { getArticleVotes } from "../services/userAPI";
import { toast } from "react-toastify";
import { ArrowUp, CaretUpFill } from "react-bootstrap-icons";

const HomePage = (props) => {
  const [articles, setArticles] = useState([]);
  const [score, setScore] = useState(0);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchArticle();
  }, []);

  const { user } = props;

  const fetchArticle = async () => {
    try {
      setArticles(await getArticles());
      setLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  const setArticlesChild = (data) => {
    setArticles(data);
  };

  return (
    <React.Fragment>
      <h1>Home</h1>
      <p>{user.username ? <span>connecté</span> : "Déconnecté"}</p>
      <div className="row article-add my-4 text-center">
        <div className="col-lg-12">
          <Link to={`/articles/new`} className="btn btn-primary">
            <i className="fa fa-plus"></i> Ajouter une publication
          </Link>
        </div>
      </div>
      <ArticleList
        articles={articles}
        setArticlesChild={setArticlesChild}
        user={user}
        loaded={loaded}
      />
    </React.Fragment>
  );
};

export default HomePage;
