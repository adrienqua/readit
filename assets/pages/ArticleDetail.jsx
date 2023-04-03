import React, { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { getArticle, getComments } from "../services/articleAPI"
import { newComment } from "../services/commentAPI"
import Comments from "../common/Comments"
import Score from "../common/Score"
import { handleNewScore, handleScore } from "../scripts/score"
import { updateArticle } from "./../services/articleAPI"
import { newVote, updateVote } from "../services/voteAPI"
import { updateUser } from "../services/userAPI"
import { AuthContext } from "../contexts/authContext"

const ArticleDetail = (props) => {
    const [comments, setComments] = useState([])
    const [loaded, setLoaded] = useState(false)

    const [article, setArticle] = useState({
        title: "",
        content: "",
        picture: "",
        tags: [
            {
                label: "",
            },
        ],
    })

    const [user, setUser] = useContext(AuthContext)

    useEffect(() => {
        fetchArticle()
        fetchComments()
        console.log("art details ue")
    }, [])

    const fetchArticle = async () => {
        try {
            setArticle(await getArticle(props.match.params.id))
            setLoaded(true)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchComments = async () => {
        try {
            setComments(await getComments(props.match.params.id))
        } catch (error) {
            console.log(error)
        }
    }

    const setCommentsChild = (data) => {
        setComments(data)
    }

    const updateScore = async (item, action) => {
        if (!user.username) {
            history.push("/login")
        }

        //check if the user got a vote from this article
        const findScore = user?.votes?.some(
            (vote) => item.votes.map((v) => v["@id"]).indexOf(vote) >= 0
        )

        const data = { ...item }

        if (!findScore) {
            console.log("New vote !")
            handleNewScore(action, data)
            handleSubmitNewScore(data)
            console.log("user ue", user, item, findScore)
        } else {
            console.log("update vote !")
            handleScore(item, action, data)
            handleSubmitScore(item, data)
        }
    }

    const handleSubmitNewScore = async (data) => {
        //Reformat
        const userId = user["@id"]
        const articleId = data["@id"].slice(1)
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

                //setArticle
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
                console.log("dataa", data)
                setArticle(data)
            })
            await updateArticle(data.id, { score: data.score })
            await updateUser(author.id, {
                karma: author.karma,
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmitScore = async (item, data) => {
        //Reformat
        const voteData = { ...item.votes[0] }
        voteData.user = voteData.user["@id"].slice(1)

        //Submit
        setArticle(data)
        if (user.id === data.author.id) {
            setUser((prevState) => ({
                ...prevState,
                karma: data.author.karma,
            }))
        }

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
                            <div className="article-header d-flex">
                                <Score
                                    data={article}
                                    updateScore={updateScore}
                                />
                                <div className="article-header-container ps-3">
                                    <div className="article-categories">
                                        <span className="badge bg-secondary">
                                            {article.tags[0].label}
                                        </span>
                                    </div>
                                    <h1 className="card-title">
                                        {article.title}
                                    </h1>
                                </div>
                            </div>
                            <p className="article-content mt-3">
                                {" "}
                                {article.content}
                            </p>
                            <Link to={`/articles/${article.id}/edit`}>
                                <button className="btn btn-light mx-1">
                                    <i
                                        className="fa fa-pencil"
                                        aria-hidden="true"
                                    ></i>
                                </button>
                            </Link>
                        </React.Fragment>
                    )}
                </div>
            </div>

            <Comments
                comments={comments}
                article={article}
                user={user}
                fetchComments={fetchComments}
                loaded={loaded}
                setComments={setCommentsChild}
            />
        </React.Fragment>
    )
}

export default ArticleDetail
