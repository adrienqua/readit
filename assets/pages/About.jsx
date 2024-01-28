import React from "react"

const About = () => {
    return (
        <React.Fragment>
            <div className="card mt-4 col-md-8 offset-md-2 py-4 px-5">
                <div className="card-body ">
                    <h1 className="card-title">A propos</h1>
                    <p>Readit est un site inspiré de Reddit.</p>
                    <p>Il utilise React ainsi qu'une API développée par mes soins avec Symfony et Api Platform.</p>
                    <hr />
                    <h3>Features :</h3>
                    <ul>
                        <li>
                            <i className="fa  fa-sign-in" aria-hidden="true"></i> Système de Login et d'authentification
                            avec token.
                        </li>
                        <li>
                            <i className="fa fa-user-circle-o" aria-hidden="true"></i> Espace utilisateur pour modifier
                            ses informations.
                        </li>
                        <li>
                            <i className="fa fa-database" aria-hidden="true"></i> CRUD avec affichage, création,
                            modification et suppression de publications.
                        </li>
                        <li>
                            <i className="fa fa-image" aria-hidden="true"></i> Upload d'images et de fichiers via API.
                        </li>
                        <li>
                            <i className="fa fa-arrow-up" aria-hidden="true"></i> Système de Vote et Karma.
                        </li>
                        <li>
                            <i className="fa fa-heart" aria-hidden="true"></i> Système de Like.
                        </li>
                        <li>
                            <i className="fa fa-comments" aria-hidden="true"></i> Commentaires de publications et
                            réponses imbriquées avec une profondeur infinie.
                        </li>
                        <li>
                            <i className="fa fa-tags" aria-hidden="true"></i> Affichage des publications selon
                            l'utilisateur ou la catégorie.
                        </li>
                        <li>
                            <i className="fa fa-arrow-down" aria-hidden="true"></i> Scroll infini.
                        </li>
                    </ul>
                </div>
            </div>
        </React.Fragment>
    )
}
export default About
