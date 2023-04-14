import React, { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { newArticle, newArticlePicture } from "../services/articleAPI"
import { getTags } from "../services/tagsAPI"
import { updateUser } from "../services/userAPI"
import { toast } from "react-toastify"
import Input from "../common/Input"
import { Multiselect } from "multiselect-react-dropdown"
import { AuthContext } from "./../contexts/authContext"
import { newVote } from "../services/voteAPI"

const ArticleNew = (props) => {
    const [tags, setTags] = useState([])
    const [article, setArticle] = useState({
        title: "",
        content: "",
        tags: [
            {
                label: "",
            },
        ],
        file: [],
        score: 1,
    })
    const [errors, setErrors] = useState({})

    const [user, setUser] = useContext(AuthContext)

    useEffect(() => {
        fetchTags()
    }, [user])

    const fetchTags = async () => {
        try {
            setTags(await getTags())
            const userId = user["@id"]
            console.log(userId)
            setArticle({ ...article, author: userId })
        } catch (error) {
            console.log(error)
        }
    }

    const handleChange = (e) => {
        setArticle({
            ...article,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            await newArticle(article).then((response) => {
                //Upvote the publication by default
                const articleId = response.data["@id"]
                const userId = response.data.author["@id"]
                const file = article.file[0]
                newVote({
                    user: userId,
                    article: articleId,
                    isUp: true,
                }).then((response) => {
                    //Update user score and add the vote to the user
                    const voteId = response.data["@id"]
                    const userVotes = [...user.votes].concat(voteId)
                    setUser({
                        ...user,
                        karma: user.karma + 1,
                        votes: userVotes,
                    })
                })
                if (file) {
                    const responseId = response.data.id
                    const fileData = new FormData()
                    fileData.append("file", file)
                    return newArticlePicture(responseId, fileData)
                }
            })
            await updateUser(user.id, {
                karma: user.karma + 1,
            })

            props.history.push("/")

            toast.success("Publication créée.")
        } catch (error) {
            const violations = error.response.data["violations"]
            console.log(violations)
            violations.forEach((violation) => {
                console.log(violation)
                setErrors((prev) => {
                    return {
                        ...prev,
                        [violation.propertyPath]: violation.message,
                    }
                })
            })
        }
    }

    const onSelect = (selectedList, selectedItem) => {
        const data = selectedList.map((d) => {
            return { label: d.label }
        })
        setArticle({ ...article, tags: data })
        console.log(article.tags)
    }

    const onRemove = (selectedList, removedItem) => {
        const data = selectedList.map((d) => {
            return { label: d.label }
        })
        setArticle({ ...article, tags: data })
    }

    return (
        <React.Fragment>
            <div className="col-md-6 offset-md-3">
                <h1>
                    <i
                        className="fa fa-fw fa-newspaper-o"
                        aria-hidden="true"
                    ></i>{" "}
                    Créer une publication
                </h1>

                <form onSubmit={handleSubmit} className="mt-4">
                    <Input
                        name="title"
                        label="Titre"
                        handleChange={(e) => handleChange(e)}
                        error={errors.title}
                    />
                    <Input
                        type="file"
                        name="picture"
                        label="Téléverser une image"
                        handleChange={(e) =>
                            setArticle({ ...article, file: e.target.files })
                        }
                    />
                    <Input
                        input="textarea"
                        name="content"
                        label="Contenu"
                        handleChange={(e) => handleChange(e)}
                        error={errors.content}
                    />
                    <Multiselect
                        options={tags}
                        displayValue="label"
                        placeholder="Catégories"
                        onSelect={onSelect}
                        onRemove={onRemove}
                    />
                    <input
                        className="btn btn-primary mt-1"
                        type="submit"
                        value="Publier"
                    />
                </form>
            </div>
        </React.Fragment>
    )
}

export default ArticleNew
