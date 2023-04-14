import React, { useState, useEffect } from "react"
import { login, logout } from "../services/loginAPI"
import { Link } from "react-router-dom"
import { updateArticle } from "./../services/articleAPI"
import { getUserWithUsername, updateUser } from "../services/userAPI"
import Input from "../common/Input"
import { toast } from "react-toastify"
import Loader from "../common/Loader"

const UserSettings = (props) => {
    const [profileUser, setProfileUser] = useState({
        email: "",
        plainPassword: "",
        firstname: "",
        lastname: "",
    })
    const [isLoaded, setIsLoaded] = useState(false)

    const { user, setUser } = props

    useEffect(() => {
        fetchUser()
    }, [])

    const handleChange = (e) => {
        setProfileUser({
            ...profileUser,
            [e.target.name]: e.target.value,
        })
    }

    const fetchUser = async () => {
        try {
            setProfileUser(
                await getUserWithUsername(props.match.params.username)
            )
            setIsLoaded(true)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        await updateUser(profileUser.id, profileUser)
        toast.success("Informations modifiées.")
    }
    return (
        <React.Fragment>
            {isLoaded ? (
                <>
                    <div className="user-profile">
                        <h1 className="text-center">
                            <i
                                className="fa fa-user-circle-o  fa-fw"
                                aria-hidden="true"
                            ></i>
                            Profil de {profileUser.username}
                        </h1>
                        <h4 className="text-center">
                            <i
                                className="fa fa-fw fa-certificate text-primary"
                                aria-hidden="true"
                            ></i>
                            {profileUser.karma} karma
                        </h4>
                        <div className="text-center">
                            <Link
                                className="profile-articles btn btn-light mx-1"
                                to={`/user/${profileUser.username}/articles`}
                            >
                                <i
                                    className="fa fa-fw fa-newspaper-o"
                                    aria-hidden="true"
                                ></i>{" "}
                                Publications
                            </Link>
                            <Link
                                className="profile-like btn btn-light mx-1 "
                                to={`/user/${profileUser.username}/favorites`}
                            >
                                <i
                                    className="fa fa-fw fa-heart"
                                    aria-hidden="true"
                                ></i>{" "}
                                Favoris
                            </Link>
                        </div>
                        {user.username === profileUser.username ? (
                            <>
                                <div className="user-settings card mt-4 col-md-8 offset-md-2 py-4 px-5">
                                    <div className="card-body">
                                        <h2 className="card-title">
                                            <i
                                                className="fa fa-file-text-o  fa-fw"
                                                aria-hidden="true"
                                            ></i>
                                            Informations
                                        </h2>

                                        <form
                                            onSubmit={handleSubmit}
                                            className="mt-4 text-center"
                                        >
                                            <Input
                                                name="email"
                                                label="Email"
                                                type="email"
                                                handleChange={(e) =>
                                                    handleChange(e)
                                                }
                                                value={profileUser.email}
                                            />
                                            <Input
                                                name="plainPassword"
                                                label="Mot de passe"
                                                type="password"
                                                handleChange={(e) =>
                                                    handleChange(e)
                                                }
                                                value={
                                                    profileUser.plainPassword
                                                }
                                                minLength={6}
                                            />
                                            <Input
                                                name="firstname"
                                                label="Prénom"
                                                handleChange={(e) =>
                                                    handleChange(e)
                                                }
                                                value={profileUser.firstname}
                                            />
                                            <Input
                                                name="lastname"
                                                label="Nom de famille"
                                                handleChange={(e) =>
                                                    handleChange(e)
                                                }
                                                value={profileUser.lastname}
                                            />

                                            <button
                                                className="btn btn-primary mt-1"
                                                type="submit"
                                            >
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
                                    <a
                                        className="btn btn-primary"
                                        onClick={() => logout()}
                                    >
                                        <i
                                            className="fa fa-fw fa-sign-out"
                                            aria-hidden="true"
                                        ></i>{" "}
                                        Se déconnecter
                                    </a>
                                </div>
                            </>
                        ) : null}
                    </div>
                </>
            ) : (
                <Loader />
            )}
        </React.Fragment>
    )
}

export default UserSettings
