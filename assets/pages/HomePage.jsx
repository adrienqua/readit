import React, { useState, useEffect, useContext } from "react"

import { Link } from "react-router-dom"
import ArticleList from "../common/ArticleList"
import { getArticles } from "../services/articleAPI"

import { newVote, updateVote } from "../services/voteAPI"
import { getArticleVotes } from "../services/userAPI"
import { toast } from "react-toastify"
import { ArrowUp, CaretUpFill } from "react-bootstrap-icons"
import SearchBar from "../common/SearchBar"
import { handleScroll } from "../scripts/scroll"
import { newFavorite } from "../services/favoriteAPI"
import { AuthContext } from "./../contexts/authContext"

const HomePage = ({ user }) => {
    const [articles, setArticles] = useState([])
    const [score, setScore] = useState(0)
    const [loaded, setLoaded] = useState(false)
    const [test, setTest] = useState("")

    //const user = useContext(AuthContext)

    const setArticlesChild = (data) => {
        setArticles(data)
    }

    const fetchArticles = async (pageNumber) => {
        try {
            const formatArray = [...articles].concat(
                await getArticles(pageNumber)
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
                <div className="text-center">
                    <h1>Accueil</h1>
                </div>
                <div className="row article-add my-4 text-center">
                    <div className="col-lg-12">
                        <Link to={`/articles/new`} className="btn btn-primary">
                            <i className="fa fa-plus"></i> Ajouter une
                            publication
                        </Link>
                    </div>
                </div>
                <ArticleList
                    user={user}
                    setArticles={setArticlesChild}
                    articles={articles}
                    fetchArticles={fetchArticles}
                    loaded={loaded}
                />
            </div>
        </React.Fragment>
    )
}

export default HomePage
