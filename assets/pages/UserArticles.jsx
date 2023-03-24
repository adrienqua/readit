import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
    getUserWithUsername,
    getUserArticles,
    updateUser,
} from "../services/userAPI"
import ArticleList from "../common/ArticleList"

const UserArticles = (props) => {
    const [articles, setArticles] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [profileUser, setProfileUser] = useState({
        karma: 0,
    })

    const { user } = props

    useEffect(() => {
        fetchUser()
    }, [])

    useEffect(() => {
        fetchArticles(1)
    }, [profileUser])

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
                await getUserArticles(profileUser.id, pageNumber)
            )
            if (formatArray.length === articles.length) {
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
            <div id="articles">
                <h1 className="text-center">
                    <i
                        className="fa fa-user-circle-o  fa-fw"
                        aria-hidden="true"
                    ></i>
                    Publications de {props.match.params.username}
                </h1>
                <h4 className="text-center">
                    <i
                        className="fa fa-fw fa-certificate text-primary"
                        aria-hidden="true"
                    ></i>
                    {profileUser.karma} karma
                </h4>
                {articles && (
                    <ArticleList
                        user={user}
                        setArticles={setArticlesChild}
                        articles={articles}
                        fetchArticles={fetchArticles}
                        loaded={loaded}
                    />
                )}
            </div>
        </React.Fragment>
    )
}

export default UserArticles
