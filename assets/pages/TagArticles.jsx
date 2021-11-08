import React, { useState, useEffect } from "react";

import ArticleList from "../common/ArticleList";
import { getTagArticles, getTagWithLabel } from "../services/tagsAPI";

const TagArticles = (props) => {
  const [articles, setArticles] = useState([]);
  const [tag, setTag] = useState([]);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, [tag]);

  useEffect(() => {
    fetchTag();
  }, []);

  const { user } = props;

  const fetchTag = async () => {
    try {
      setTag(await getTagWithLabel(props.match.params.label));

      setLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchArticles = async () => {
    setArticles(await getTagArticles(tag.id));
  };

  const setArticlesChild = (data) => {
    setArticles(data);
  };

  return (
    <React.Fragment>
      <h1 className="text-center">
        <i className="fa fa-fw fa-tags" aria-hidden="true"></i>Catégorie{" "}
        {props.match.params.label}
      </h1>
      <ArticleList
        articles={articles}
        setArticlesChild={setArticlesChild}
        user={user}
        loaded={loaded}
      />
    </React.Fragment>
  );
};

export default TagArticles;
