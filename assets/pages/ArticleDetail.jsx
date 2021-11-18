import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getArticle, getComments } from "../services/articleAPI";
import { newComment } from "../services/commentAPI";
import Comments from "../common/Comments";
import Score from "../common/Score";

const ArticleDetail = (props) => {
  const [comments, setComments] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const [article, setArticle] = useState({
    title: "",
    content: "",
    picture: "",
    tags: [
      {
        label: "",
      },
    ],
  });

  const { user } = props;

  useEffect(() => {
    fetchArticle();
    fetchComments();
    console.log("art details ue");
  }, []);

  const fetchArticle = async () => {
    try {
      setArticle(await getArticle(props.match.params.id));
      setLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchComments = async () => {
    try {
      setComments(await getComments(props.match.params.id));
    } catch (error) {
      console.log(error);
    }
  };

  const setCommentsChild = (data) => {
    setComments(data);
  };

  const updateScore = () => {};
  const date = (format) => {
    var options = { year: "numeric", month: "long", day: "numeric" };
    return format.toLocaleString().slice(0, 19).replace("T", " à ");
  };

  return (
    <React.Fragment>
      <div className="card mt-4 col-md-8 offset-md-2 p-3">
        <div className="card-body">
          {!loaded ? (
            <div className="row loading">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            <React.Fragment>
              <Score data={article} updateScore={updateScore} />
              <span className="badge bg-secondary">
                {article.tags[0].label}
              </span>
              <h1 className="card-title">{article.title}</h1>
              <p className="article-content"> {article.content}</p>
              <Link to={`/articles/${article.id}/edit`}>
                <button className="btn btn-light mx-1">
                  <i className="fa fa-pencil" aria-hidden="true"></i>
                </button>
              </Link>
            </React.Fragment>
          )}
        </div>
      </div>

      <Comments
        comments={comments}
        date={date}
        article={article}
        user={user}
        fetchComments={fetchComments}
        loaded={loaded}
        setComments={setCommentsChild}
      />
    </React.Fragment>
  );
};

export default ArticleDetail;
