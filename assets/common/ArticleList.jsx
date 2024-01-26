import React, { useState, useEffect, useContext } from "react"
import { useHistory } from "react-router-dom"
import { deleteArticle, updateArticle, newArticlePicture } from "../services/articleAPI"
import { toast } from "react-toastify"
import ArticleListItem from "./ArticleListItem"
import { newFavorite } from "../services/favoriteAPI"
import SearchBar from "./SearchBar"
import { AuthContext } from "./../contexts/authContext"
import { handleScroll } from "../scripts/scroll"
import { handleNewScore, handleScore, handleSubmitNewScore, handleSubmitScore } from "../scripts/score"
import Loader from "./Loader"
import { getTags } from "../services/tagsAPI"

const ArticleList = (props) => {
    const [addVote, setAddVote] = useState()
    const [karma, setKarma] = useState()
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResult, setSearchResult] = useState([])

    const [filtered, setFiltered] = useState([])

    const [scrolled, setScrolled] = useState(false)
    const [page, setPage] = useState(1)
    const [tags, setTags] = useState([])

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

    useEffect(() => {
        fetchTags()
    }, [])

    const fetchTags = async () => {
        try {
            setTags(await getTags())
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
        const findScore = user?.votes?.some((vote) => item.votes.map((v) => v["@id"]).indexOf(vote) >= 0)

        const datas = [...articles]
        const index = datas.indexOf(item)
        datas[index] = { ...datas[index] }
        const data = datas[index]

        if (!findScore) {
            console.log("New vote !")
            handleNewScore(action, data)
            handleSubmitNewScore(data, datas, setArticles, user, setUser)
            console.log("user ue", user, item, findScore)
        } else {
            console.log("update vote !")
            handleScore(item, action, data)
            handleSubmitScore(data, datas, setArticles, user, setUser)
        }
    }

    const handleSearch = (query) => {
        const ogArticles = [...articles]
        //console.log(articles)
        setSearchQuery(query)
        if (query !== "") {
            const searchedArticle = ogArticles.filter((article) => {
                return JSON.stringify(article).toLowerCase().includes(query.toLowerCase())
            })
            setSearchResult(searchedArticle)
            setFiltered(searchedArticle)
        } else {
            setSearchResult(articles)
        }
    }

    const handleLike = async (id, like, key, data) => {
        if (!user.username) {
            history.push("/login")
        }

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
                    newArticles[key]["favorites"].push(`/api/favorites/${newFavorite}`)
                    newUserFavorite.push(`/api/favorites/${newFavorite}`)
                    setArticles(newArticles)
                    setUser({ ...user, favorites: newUserFavorite })
                })
            }
            if (like === "dislike") {
                const filterArray = user.favorites.filter((fav) => data.favorites.includes(fav))
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

    const handleSubmitEdit = async (e, article, closeRef, setErrors, setIsValid) => {
        e.preventDefault()

        try {
            await updateArticle(article.id, {
                title: article.title,
                content: article.content,
                tags: article.tags,
            })
            const originalArticles = [...articles]
            const index = originalArticles.findIndex((art) => art.id === article.id)
            originalArticles[index] = article
            setArticles(originalArticles)

            setErrors({})
            setIsValid(true)
            closeRef.current.click()
            //history.push("/")
            toast.success("Publication modifiée.")
        } catch (error) {
            const violations = error.response.data["violations"]
            console.log(violations)
            const errorsObject = {}
            violations.forEach((violation) => {
                console.log(violation)
                errorsObject[violation.propertyPath] = violation.message
            })

            setErrors(errorsObject)
            setIsValid(false)
        }

        if (article.file) {
            const fileData = new FormData()
            fileData.append("file", article.file[0])
            await newArticlePicture(article.id, fileData)
            window.location = "/"
        }
    }

    return (
        <div>
            <SearchBar handleSearch={handleSearch} />

            {!loaded ? (
                <Loader />
            ) : (
                <div className="row article mb-5">
                    {filtered.map((article, key) => (
                        <ArticleListItem
                            articles={articles}
                            article={article}
                            tags={tags}
                            setArticles={setArticles}
                            updateScore={updateScore}
                            handleDelete={handleDelete}
                            key={article.id}
                            articleKey={key}
                            handleLike={handleLike}
                            handleSubmitEdit={handleSubmitEdit}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default ArticleList
