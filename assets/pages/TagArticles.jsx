import React, { useState, useEffect } from "react"

import ArticleList from "../common/ArticleList"
import { getTagArticles, getTagWithLabel } from "../services/tagsAPI"

const TagArticles = (props) => {
    const [articles, setArticles] = useState([])
    const [tag, setTag] = useState({})

    const [loaded, setLoaded] = useState(false)

    const { user } = props

    useEffect(() => {
        fetchTag()
    }, [props.match.params.label])

    useEffect(() => {
        fetchArticles(1)
        console.log(articles)
    }, [tag])

    useEffect(() => {}, [articles])

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
            let formatArray = []
            if (pageNumber === 1) {
                formatArray = await getTagArticles(tag.id, pageNumber)
            } else {
                formatArray = [...articles].concat(
                    await getTagArticles(tag.id, pageNumber)
                )
            }

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
                    <i className="fa fa-fw fa-tags" aria-hidden="true"></i>
                    Catégorie {props.match.params.label}
                </h1>
                {tag.label && (
                    <ArticleList
                        articles={articles}
                        setArticles={setArticles}
                        user={user}
                        fetchArticles={fetchArticles}
                        loaded={loaded}
                    />
                )}
            </div>
        </React.Fragment>
    )
}

export default TagArticles
