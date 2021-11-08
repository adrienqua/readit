import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { newArticle } from "../services/articleAPI";
import { getTags } from "../services/tagsAPI";
import { toast } from "react-toastify";

const ArticleNew = (props) => {
  const [tags, setTags] = useState([]);
  const [article, setArticle] = useState({
    title: "",
    content: "",
    tags: [
      {
        label: "",
      },
    ],
    file: [],
  });

  const { user } = props;

  useEffect(() => {
    fetchTags();
  }, [user]);

  const fetchTags = async () => {
    try {
      setTags(await getTags());
      const userId = user["@id"].slice(1);
      console.log(userId);
      setArticle({ ...article, author: userId });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setArticle({
      ...article,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await newArticle(article, article.file[0]);
    props.history.push("/");
    toast.success("Publication créée.");
  };

  return (
    <React.Fragment>
      <h1>
        <i class="fa fa-fw fa-newspaper-o" aria-hidden="true"></i> Créer une
        publication
      </h1>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="form-floating mb-3">
          <input
            className="form-control"
            type="text"
            name="title"
            placeholder=" "
            value={article.title}
            onChange={(e) => handleChange(e)}
          />
          <label>Titre</label>
        </div>
        <div className="form-group mb-3">
          <label className="form-label">Téléverser une image</label>
          <input
            className="form-control form-control"
            type="file"
            name="picture"
            onChange={(e) => setArticle({ ...article, file: e.target.files })}
          />
        </div>
        <div className="form-floating mb-3">
          <textarea
            className="form-control"
            type="text"
            name="content"
            placeholder=" "
            value={article.content}
            onChange={(e) => handleChange(e)}
            rows="5"
          />
          <label>Contenu</label>
        </div>
        <div className="form-floating mb-3">
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
        </div>
        <input className="btn btn-primary mt-1" type="submit" value="Publier" />
      </form>
    </React.Fragment>
  );
};

export default ArticleNew;
