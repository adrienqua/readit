import React, { useState, useEffect, useRef } from "react"
import { Link, useHistory } from "react-router-dom"
import {
    getArticle,
    updateArticle,
    newArticlePicture,
} from "../services/articleAPI"
import { getTags } from "../services/tagsAPI"
import Input from "../common/Input"
import { ToastContainer, toast } from "react-toastify"
import { Multiselect } from "multiselect-react-dropdown"

const ArticleEdit = ({ id, submitRef, setArticles, articles }) => {
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
    let history = useHistory()

    useEffect(() => {
        fetchArticle()
        fetchTags()
    }, [])

    const fetchArticle = async () => {
        try {
            setArticle(await getArticle(id))
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

    const handleChange = (e) => {
        setArticle({ ...article, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        article.author = article.author["@id"].slice(1)

        const originalArticles = articles
        const index = originalArticles.findIndex((art) => art.id === article.id)
        originalArticles[index] = article
        setArticles(originalArticles)
        console.log("og", originalArticles)

        try {
            await updateArticle(id, article)
        } catch (error) {
            console.log(error)
        }

        if (article.file) {
            const fileData = new FormData()
            fileData.append("file", article.file[0])
            await newArticlePicture(id, fileData)
        }
        //history.push("/")
        //window.location = "/"
        toast.success("Publication modifiée.")
    }

    const onSelect = (selectedList, selectedItem) => {
        setArticle({ ...article, tags: selectedList })
        console.log(article.tags)
    }

    const onRemove = (selectedList, removedItem) => {
        setArticle({ ...article, tags: selectedList })
    }

    return (
        <React.Fragment>
            {/*             <h1>
                <i className="fa fa-fw fa-pencil" aria-hidden="true"></i>Editer
                la publication {id}
            </h1> */}

            <form className="mt-4">
                <Input
                    name="title"
                    label="Titre"
                    handleChange={(e) => handleChange(e)}
                    value={article.title}
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
                    value={article.content}
                />
                <Multiselect
                    options={tags}
                    displayValue="label"
                    selectedValues={article.tags}
                    placeholder="Catégories"
                    onSelect={onSelect}
                    onRemove={onRemove}
                />
                {/* <div className="form-floating mb-3">
          <select
            className="form-select"
            type="text"
            name="label"
            placeholder=" "
            value={article.tags[0].label}
            onChange={(e) =>
              setArticle({ ...article, tags: [{ label: e.target.value }] })
            }
          >
            {tags.map((tag) => (
              <option key={tag.label}>{tag.label}</option>
            ))}
          </select>
          <label>Catégorie</label>
        </div> */}

                <input
                    className="btn btn-primary mt-1 d-none"
                    type="submit"
                    value="Editer"
                    ref={submitRef}
                    onClick={handleSubmit}
                />
            </form>
        </React.Fragment>
    )
}

export default ArticleEdit
