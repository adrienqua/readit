import React, { useState, useEffect } from "react"

import ArticleList from "../common/ArticleList"
import { getTagArticles, getTagWithLabel } from "../services/tagsAPI"

const TagArticles = (props) => {
    const [articles, setArticles] = useState([])
    const [tag, setTag] = useState([])

    const [loaded, setLoaded] = useState(false)

    const { user } = props

    useEffect(() => {
        fetchArticles(1)
    }, [tag])

    useEffect(() => {
        fetchTag()
    }, [])

    const fetchTag = async () => {
        try {
            setTag(await getTagWithLabel(props.match.params.label))

            setLoaded(true)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchArticles = async (pageNumber) => {
        try {
            const formatArray = [...articles].concat(
                await getTagArticles(tag.id, pageNumber)
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

    const setArticlesChild = (data) => {
        setArticles(data)
    }

    return (
        <React.Fragment>
            <h1 className="text-center">
                <i className="fa fa-fw fa-tags" aria-hidden="true"></i>Catégorie{" "}
                {props.match.params.label}
            </h1>
            <ArticleList
                articles={articles}
                setArticles={setArticlesChild}
                user={user}
                fetchArticles={fetchArticles}
                loaded={loaded}
            />
        </React.Fragment>
    )
}

export default TagArticles
