import React, { useState, useEffect } from "react"
import { login } from "./../services/loginAPI"
import { Link } from "react-router-dom"
import { GoogleLogin } from "react-google-login"
import Input from "../common/Input"

const Login = (props) => {
    const [user, setUser] = useState({
        username: "",
        password: "",
    })

    useEffect(() => {}, [])

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await login(user)
        } catch (error) {
            console.log(error.response)
        }

        window.location = "/"
    }

    const responseGoogle = (response) => {
        console.log(response)
    }

    return (
        <React.Fragment>
            <div className="login text-center mx-auto">
                <h1 className="mb-4">Se connecter</h1>
                <form onSubmit={handleSubmit} className="mb-3">
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

                    <input
                        className="btn btn-primary"
                        type="submit"
                        value="Se connecter"
                    />
                </form>
                <p className="text-muted">
                    Vous n'avez pas de compte ?{" "}
                    <Link to="/register">Créer un compte</Link>
                </p>
                {/*                 <hr className="my-4" />
                <GoogleLogin
                    clientId="860887330842-bdb41pchu7tt096mv192o9mmup8meevo.apps.googleusercontent.com"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={"single_host_origin"}
                    buttonText="Se connecter avec Google"
                /> */}
            </div>
        </React.Fragment>
    )
}

export default Login
