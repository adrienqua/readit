import React, { useState, useEffect, useContext } from "react"
import { useHistory } from "react-router-dom"
import Score from "../common/Score"
import {
    deleteArticle,
    updateArticle,
    getArticles,
} from "../services/articleAPI"
import { updateUser } from "../services/userAPI"
import { newVote, updateVote } from "../services/voteAPI"
import { toast } from "react-toastify"
import ArticleListItem from "./ArticleListItem"
import { newFavorite } from "../services/favoriteAPI"
import SearchBar from "./SearchBar"
import { AuthContext } from "./../contexts/authContext"
import { handleScroll } from "../scripts/scroll"
import { handleNewScore, handleScore } from "../scripts/score"

const ArticleList = (props) => {
    const [addVote, setAddVote] = useState()
    const [karma, setKarma] = useState()
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResult, setSearchResult] = useState([])

    const [filtered, setFiltered] = useState([])

    const [scrolled, setScrolled] = useState(false)
    const [page, setPage] = useState(1)

    const [user, setUser] = useContext(AuthContext)

    const { setArticles, articles, fetchArticles, loaded } = props
    const history = useHistory()

    useEffect(() => {
        fetchArticles(page)
    }, [page])

    useEffect(() => {
        handleScroll(page, setPage, scrolled)
        setFiltered(articles)
    }, [articles])

    const fetchArticle = async () => {
        try {
            setArticles(await getArticles())
        } catch (error) {
            console.log(error)
        }
    }

    const addNewVote = async () => {
        try {
            await newVote(addVote)
        } catch (error) {
            console.log(error)
        }
    }

    const truncate = (str) => {
        return str.length > 200 ? str.substring(0, 200) + " ..." : str
    }

    const handleDelete = async (art) => {
        const originalArticles = articles
        const article = originalArticles.filter((a) => a.id != art.id)
        setArticles(article)
        try {
            await deleteArticle(art.id)
            toast.success("Publication supprimée.")
        } catch (error) {
            console.log(error)
        }
    }

    const updateScore = async (item, action) => {
        if (!user.username) {
            history.push("/login")
        }

        //check if the user got a vote from this article
        const findScore = user?.votes?.some(
            (vote) => item.votes.map((v) => v["@id"]).indexOf(vote) >= 0
        )

        const datas = [...articles]
        const index = datas.indexOf(item)
        datas[index] = { ...datas[index] }
        const data = datas[index]

        if (!findScore) {
            console.log("New vote !")
            handleNewScore(action, data)
            handleSubmitNewScore(item, data, datas)
            console.log("user ue", user, item, findScore)
        } else {
            console.log("update vote !")
            handleScore(item, action, data)
            handleSubmitScore(item, data, datas)
        }
    }

    const handleSubmitNewScore = async (item, data, datas) => {
        //Reformat
        const userId = user["@id"]
        const articleId = item["@id"].slice(1)
        const author = data.author
        console.log(data)

        //Submit
        try {
            await newVote({
                user: userId,
                article: articleId,
                isDown: data.down,
                isUp: data.up,
            }).then((response) => {
                //setUser
                const newVoteId = response.data.id
                const userNewVotes = [...user.votes]
                userNewVotes.push(`/api/votes/${newVoteId}`)
                setUser((prevState) => ({
                    ...prevState,
                    votes: userNewVotes,
                }))
                if (user.id === data.author.id) {
                    setUser((prevState) => ({
                        ...prevState,
                        karma: data.author.karma,
                    }))
                }

                //setArticles
                const newVote = {
                    ["@id"]: `/api/votes/${newVoteId}`,
                    id: newVoteId,
                    isUp: response.data.isUp,
                    isDown: response.data.isDown,
                    user: {
                        ["@id"]: userId,
                    },
                }
                data.votes.push(newVote)
                setArticles(datas)
            })
            await updateArticle(data.id, { score: data.score })
            await updateUser(author.id, {
                karma: author.karma,
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmitScore = async (item, data, datas) => {
        //Reformat
        const voteData = { ...item.votes[0] }
        voteData.user = voteData.user["@id"].slice(1)

        //Submit
        console.log("submit datas", datas)
        setArticles(datas)
        if (user.id === data.author.id) {
            setUser((prevState) => ({
                ...prevState,
                karma: data.author.karma,
            }))
        }

        console.log("votes", voteData)
        try {
            await updateArticle(data.id, { score: data.score })
            await updateVote(item.votes[0].id, voteData)
            await updateUser(data.author.id, {
                karma: data.author.karma,
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleSearch = (query) => {
        const ogArticles = [...articles]
        console.log(articles)
        setSearchQuery(query)
        if (query !== "") {
            const searchedArticle = ogArticles.filter((article) => {
                return JSON.stringify(article)
                    .toLowerCase()
                    .includes(query.toLowerCase())
            })
            setSearchResult(searchedArticle)
            setFiltered(searchedArticle)
        } else {
            setSearchResult(articles)
        }
    }

    const handleLike = async (id, like, key, data) => {
        try {
            const newArticles = [...articles]
            const newUserFavorite = [...user.favorites]
            if (like === "like") {
                await newFavorite({
                    isActive: true,
                    user: `/api/users/${user.id}`,
                    article: `/api/articles/${id}`,
                }).then((response) => {
                    const newFavorite = response.data.id
                    newArticles[key]["favorites"].push(
                        `/api/favorites/${newFavorite}`
                    )
                    newUserFavorite.push(`/api/favorites/${newFavorite}`)
                    setArticles(newArticles)
                    setUser({ ...user, favorites: newUserFavorite })
                })
            }
            if (like === "dislike") {
                const filterArray = user.favorites.filter((fav) =>
                    data.favorites.includes(fav)
                )
                const indexOf = data.favorites.indexOf(filterArray.toString())
                data.favorites.splice(0, 1)
                console.log(indexOf, data.favorites)

                await updateArticle(id, {
                    favorites: data.favorites,
                })

                newArticles[key]["favorites"] = data.favorites
                setArticles(newArticles)
            }
            toast.success("Favoris mis à jour !")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <SearchBar handleSearch={handleSearch} />

            {!loaded ? (
                <div className="row loading">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="row article mb-5">
                    {filtered.map((article, key) => (
                        <ArticleListItem
                            articles={articles}
                            article={article}
                            setArticles={setArticles}
                            updateScore={updateScore}
                            handleDelete={handleDelete}
                            key={article.id}
                            articleKey={key}
                            handleLike={handleLike}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default ArticleList
