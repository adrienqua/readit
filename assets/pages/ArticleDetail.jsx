import React, { useState, useEffect, useRef, useContext } from "react"
import { getArticle, getComments, newArticlePicture } from "../services/articleAPI"
import Comments from "../common/Comments"
import Score from "../common/Score"
import { handleNewScore, handleScore, handleSubmitNewScore, handleSubmitScore } from "../scripts/score"
import { updateArticle } from "./../services/articleAPI"
import { AuthContext } from "../contexts/authContext"
import Modal from "../common/Modal"
import ArticleEdit from "./ArticleEdit"
import { toast } from "react-toastify"
import Loader from "../common/Loader"
import { getTags } from "../services/tagsAPI"

const ArticleDetail = (props) => {
    const [comments, setComments] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [tags, setTags] = useState([])

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

    const [isValid, setIsValid] = useState(false)

    const [user, setUser] = useContext(AuthContext)

    const editFormRef = useRef(null)

    const closeValidatedFormRef = useRef(null)

    useEffect(() => {
        fetchArticle()
        fetchComments()
        fetchTags()
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

    const fetchTags = async () => {
        try {
            setTags(await getTags())
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
        const findScore = user?.votes?.some((vote) => item.votes.map((v) => v["@id"]).indexOf(vote) >= 0)

        const data = { ...item }

        if (!findScore) {
            console.log("New vote !")
            handleNewScore(action, data)
            handleSubmitNewScore(data, data, setArticle, user, setUser)
            console.log("user ue", user, item, findScore)
        } else {
            console.log("update vote !")
            handleScore(item, action, data)
            handleSubmitScore(data, data, setArticle, user, setUser)
        }
    }

    const handleSubmitEdit = async (e, article, closeRef, setErrors) => {
        e.preventDefault()

        try {
            await updateArticle(article.id, {
                title: article.title,
                content: article.content,
                tags: article.tags,
            })
            setArticle(article)

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
        <React.Fragment>
            <div className="card mt-4 col-md-8 offset-md-2 p-3">
                <div className="card-body">
                    {!loaded ? (
                        <Loader />
                    ) : (
                        <React.Fragment>
                            <div className="article-header d-flex">
                                <Score data={article} updateScore={updateScore} />
                                <div className="article-header-container ps-3">
                                    <div className="article-categories">
                                        <span className="badge bg-secondary">{article.tags[0].label}</span>
                                    </div>
                                    <h1 className="card-title">{article.title}</h1>
                                </div>
                            </div>
                            <p className="article-content mt-3"> {article.content}</p>
                            <button
                                className="btn btn-sm btn-light mx-1"
                                data-bs-toggle="modal"
                                data-bs-target={`#editArticleModal${article.id}`}
                            >
                                <i className="fa fa-pencil" aria-hidden="true"></i>
                            </button>
                            <Modal
                                id={`editArticleModal${article.id}`}
                                handleSubmit={() => editFormRef.current.click()}
                                action="Editer"
                                title={`Editer l'article ${article.id}`}
                                isValid={isValid}
                                content={
                                    <ArticleEdit
                                        id={article.id}
                                        data={article}
                                        tags={tags}
                                        submitRef={editFormRef}
                                        closeValidatedFormRef={closeValidatedFormRef}
                                        onSubmit={handleSubmitEdit}
                                        setIsValid={setIsValid}
                                    />
                                }
                            />
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
