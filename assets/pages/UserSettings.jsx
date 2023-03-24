import React, { useState, useEffect } from "react"
import { login, logout } from "../services/loginAPI"
import { Link } from "react-router-dom"
import { updateArticle } from "./../services/articleAPI"
import { updateUser } from "../services/userAPI"
import Input from "../common/Input"
import { toast } from "react-toastify"

const UserSettings = (props) => {
    const [profileUser, setProfileUser] = useState({
        email: "",
        plainPassword: "",
        firstname: "",
        lastname: "",
    })

    const { user, setUser } = props

    useEffect(() => {
        console.log(user)
        setProfileUser(user)
    }, [user])

    const handleChange = (e) => {
        setProfileUser({
            ...profileUser,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        await updateUser(profileUser.id, profileUser)
        toast.success("Informations modifiées.")
    }
    return (
        <React.Fragment>
            <h1 className="text-center">
                <i
                    className="fa fa-user-circle-o  fa-fw"
                    aria-hidden="true"
                ></i>
                Profil de {user.username}
            </h1>
            <h4 className="text-center">
                <i
                    className="fa fa-fw fa-certificate text-primary"
                    aria-hidden="true"
                ></i>
                {user.karma} karma
            </h4>
            <div className="text-center">
                <Link
                    className=" btn btn-light mx-1"
                    to={`user/${user.username}/articles`}
                >
                    <i
                        className="fa fa-fw fa-newspaper-o"
                        aria-hidden="true"
                    ></i>{" "}
                    Mes publications
                </Link>
                <Link
                    className=" btn btn-light mx-1"
                    to={`user/${user.username}/favorites`}
                >
                    <i className="fa fa-fw fa-heart" aria-hidden="true"></i> Mes
                    Favoris
                </Link>
            </div>
            <div className="card mt-4 col-md-8 offset-md-2 py-4 px-5">
                <div className="card-body">
                    <h2 className="card-title">
                        <i
                            className="fa fa-file-text-o  fa-fw"
                            aria-hidden="true"
                        ></i>
                        Informations
                    </h2>

                    <form onSubmit={handleSubmit} className="mt-4 text-center">
                        <Input
                            name="email"
                            label="Email"
                            type="email"
                            handleChange={(e) => handleChange(e)}
                            value={profileUser.email}
                        />
                        <Input
                            name="plainPassword"
                            label="Mot de passe"
                            type="password"
                            handleChange={(e) => handleChange(e)}
                            value={profileUser.plainPassword}
                        />
                        <Input
                            name="firstname"
                            label="Prénom"
                            handleChange={(e) => handleChange(e)}
                            value={profileUser.firstname}
                        />
                        <Input
                            name="lastname"
                            label="Nom de famille"
                            handleChange={(e) => handleChange(e)}
                            value={profileUser.lastname}
                        />

                        <button className="btn btn-primary mt-1" type="submit">
                            <i
                                className="fa fa-fw fa-pencil"
                                aria-hidden="true"
                            ></i>{" "}
                            Mettre à jour
                        </button>
                    </form>
                </div>
            </div>

            <div className="logout text-center mt-3">
                <a className="btn btn-primary" onClick={() => logout()}>
                    <i className="fa fa-fw fa-sign-out" aria-hidden="true"></i>{" "}
                    Se déconnecter
                </a>
            </div>
        </React.Fragment>
    )
}

export default UserSettings
