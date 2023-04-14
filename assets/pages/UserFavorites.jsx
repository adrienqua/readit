import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getUserWithUsername, updateUser } from "../services/userAPI"
import ArticleList from "../common/ArticleList"
import { getFavoritesArticles } from "../services/articleAPI"

const UserFavorites = (props) => {
    const [articles, setArticles] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [profileUser, setProfileUser] = useState({
        karma: 0,
        id: 0,
    })

    const { user } = props

    useEffect(() => {
        fetchUser()
    }, [])

    const fetchUser = async () => {
        try {
            setProfileUser(
                await getUserWithUsername(props.match.params.username)
            )
        } catch (error) {
            console.log(error)
        }
    }

    const setArticlesChild = (data) => {
        setArticles(data)
    }

    const fetchArticles = async (pageNumber) => {
        try {
            const formatArray = [...articles].concat(
                await getFavoritesArticles(profileUser.id, pageNumber)
            )
            if (
                formatArray.length === articles.length &&
                articles.length !== 0
            ) {
                setScrolled(true)
            }
            setArticles(formatArray)
            setLoaded(true)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <React.Fragment>
            <div className="user-favorites">
                <div id="articles">
                    <div className="text-center mb-4">
                        <Link
                            className="btn btn-light"
                            to={`/user/${props.match.params.username}`}
                        >
                            <i
                                className="fa fa-fw fa-angle-left"
                                aria-hidden="true"
                            ></i>{" "}
                            Retour au profil
                        </Link>
                    </div>
                    <h1 className="text-center">
                        <i
                            className="fa fa-user-circle-o  fa-fw"
                            aria-hidden="true"
                        ></i>
                        Favoris de {props.match.params.username}
                    </h1>
                    <h4 className="text-center">
                        <i
                            className="fa fa-fw fa-certificate text-primary"
                            aria-hidden="true"
                        ></i>
                        {profileUser.karma} karma
                    </h4>
                    {articles && profileUser.id > 0 && (
                        <ArticleList
                            user={user}
                            setArticles={setArticlesChild}
                            articles={articles}
                            fetchArticles={fetchArticles}
                            loaded={loaded}
                        />
                    )}
                </div>
            </div>
        </React.Fragment>
    )
}

export default UserFavorites
