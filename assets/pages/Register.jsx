import React, { useState, useEffect } from "react"

import { Link } from "react-router-dom"
import { newUser } from "../services/userAPI"
import { login } from "./../services/loginAPI"
import Input from "../common/Input"

const Register = (props) => {
    const [user, setUser] = useState({
        username: "",
        password: "",
        email: "",
    })

    useEffect(() => {}, [])

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await newUser(user)
        window.location = "/"
    }

    return (
        <React.Fragment>
            <div className="register text-center mx-auto">
                <h1 className="mb-4">Créer un compte</h1>
                <form onSubmit={handleSubmit} className="mb-3 mx-auto">
                    <Input
                        name="username"
                        label="Pseudo* :"
                        handleChange={(e) => handleChange(e)}
                        value={user.username}
                        required
                        minLength={4}
                    />
                    <Input
                        name="password"
                        label="Mot de passe* :"
                        type="password"
                        handleChange={(e) => handleChange(e)}
                        value={user.password}
                        required
                        minLength={6}
                    />
                    <Input
                        name="email"
                        label="Email* :"
                        type="email"
                        handleChange={(e) => handleChange(e)}
                        value={user.email}
                        required
                    />

                    <input
                        className="btn btn-primary"
                        type="submit"
                        value="Se connecter"
                    />
                </form>
                <div className="row">
                    <p className="text-muted">
                        Vous avez déjà un compte ?{" "}
                        <Link to="/login">Se connecter</Link>
                    </p>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Register
