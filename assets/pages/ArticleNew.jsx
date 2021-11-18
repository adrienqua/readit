import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { newArticle } from "../services/articleAPI";
import { getTags } from "../services/tagsAPI";
import { toast } from "react-toastify";
import Input from "../common/Input";
import { Multiselect } from "multiselect-react-dropdown";

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
    score: 1,
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

  const onSelect = (selectedList, selectedItem) => {
    const data = selectedList.map((d) => {
      return { label: d.label };
    });
    setArticle({ ...article, tags: data });
    console.log(article.tags);
  };

  const onRemove = (selectedList, removedItem) => {
    const data = selectedList.map((d) => {
      return { label: d.label };
    });
    setArticle({ ...article, tags: data });
  };

  return (
    <React.Fragment>
      <h1>
        <i className="fa fa-fw fa-newspaper-o" aria-hidden="true"></i> Créer une
        publication
      </h1>

      <form onSubmit={handleSubmit} className="mt-4">
        <Input
          name="title"
          label="Titre"
          handleChange={(e) => handleChange(e)}
        />
        <Input
          type="file"
          name="picture"
          label="Téléverser une image"
          handleChange={(e) => setArticle({ ...article, file: e.target.files })}
        />
        <Input
          input="textarea"
          name="content"
          label="Contenu"
          handleChange={(e) => handleChange(e)}
        />
        <Multiselect
          options={tags}
          displayValue="label"
          placeholder="Catégories"
          onSelect={onSelect}
          onRemove={onRemove}
        />
        <input className="btn btn-primary mt-1" type="submit" value="Publier" />
      </form>
    </React.Fragment>
  );
};

export default ArticleNew;
