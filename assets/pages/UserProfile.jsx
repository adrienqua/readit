import React, { useState, useEffect } from "react";
import { login, logout } from "../services/loginAPI";
import { Link } from "react-router-dom";
import {
  getUserWithUsername,
  getUserArticles,
  updateUser,
} from "../services/userAPI";
import ArticleList from "../common/ArticleList";

const UserProfile = (props) => {
  const { user } = props;
  const [articles, setArticles] = useState([]);
  const [profileUser, setProfileUser] = useState({
    karma: 0,
  });

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [profileUser]);

  const fetchUser = async () => {
    try {
      setProfileUser(await getUserWithUsername(props.match.params.username));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchArticles = async () => {
    setArticles(await getUserArticles(profileUser.id));
    setLoaded(true);
  };

  const setArticlesChild = (data) => {
    setArticles(data);
  };

  return (
    <React.Fragment>
      <h1 className="text-center">
        <i className="fa fa-user-circle-o  fa-fw" aria-hidden="true"></i>
        Publications de {props.match.params.username}
      </h1>
      <h4 className="text-center">
        <i
          className="fa fa-fw fa-certificate text-primary"
          aria-hidden="true"
        ></i>
        {profileUser.karma} karma
      </h4>
      <ArticleList
        articles={articles}
        setArticlesChild={setArticlesChild}
        user={user}
        loaded={loaded}
      />
    </React.Fragment>
  );
};

export default UserProfile;
