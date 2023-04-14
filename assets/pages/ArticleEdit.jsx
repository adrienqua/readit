import React, { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import {
    getArticle,
    updateArticle,
    newArticlePicture,
} from "../services/articleAPI"
import { getTags } from "../services/tagsAPI"
import Input from "../common/Input"
import { ToastContainer, toast } from "react-toastify"
import { Multiselect } from "multiselect-react-dropdown"

const ArticleEdit = ({
    id,
    data,
    tags,
    submitRef,
    onSubmit,
    setIsValid,
    closeValidatedFormRef,
}) => {
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
    const [errors, setErrors] = useState({})

    useEffect(() => {
        setArticle(data)
    }, [])

    const handleChange = (e) => {
        setArticle({ ...article, [e.target.name]: e.target.value })
    }

    const onSelect = (selectedList, selectedItem) => {
        setArticle({ ...article, tags: selectedList })
        console.log(article.tags)
    }

    const onRemove = (selectedList, removedItem) => {
        setArticle({ ...article, tags: selectedList })
    }

    const handleValidate = (e) => {
        return e.preventDefault()
    }

    return (
        <React.Fragment>
            <form className="mt-4" method="POST">
                <Input
                    name="title"
                    label="Titre"
                    handleChange={(e) => handleChange(e)}
                    value={article.title}
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
                    value={article.content}
                    error={errors.content}
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
                    onClick={(e) =>
                        onSubmit(
                            e,
                            article,
                            closeValidatedFormRef,
                            setErrors,
                            setIsValid
                        )
                    }
                />
                <button
                    className="d-none"
                    type="button"
                    ref={closeValidatedFormRef}
                    data-bs-dismiss="modal"
                ></button>
            </form>
        </React.Fragment>
    )
}

export default ArticleEdit
