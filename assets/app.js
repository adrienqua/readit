/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import "./css/app.min.css"
import "font-awesome/css/font-awesome.css"
import "./css/bootstrap.min.css"
import "react-toastify/dist/ReactToastify.css"

import React, { useState, useEffect, createContext } from "react"
import ReactDOM from "react-dom"
import { Link } from "react-router-dom"
import jwtDecode from "jwt-decode"
import { getCurrentUser } from "./services/auth"
import PrivateRoute from "./common/PrivateRoute"
import HomePage from "./pages/HomePage"
import Navbar from "./pages/Navbar"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ArticleDetail from "./pages/ArticleDetail"
import ArticleEdit from "./pages/ArticleEdit"
import ArticleNew from "./pages/ArticleNew"
import { HashRouter, Route, Switch, Redirect } from "react-router-dom"
import { getUserWithUsername } from "./services/userAPI"
import UserSettings from "./pages/UserSettings"
import UserArticles from "./pages/UserArticles"
import TagArticles from "./pages/TagArticles"
import { ToastContainer, toast } from "react-toastify"
import Footer from "./pages/Footer"
import NotFound from "./pages/NotFound"
import About from "./pages/About"
import Test from "./pages/Test"
import UserFavorites from "./pages/UserFavorites"
import { AuthContext } from "./contexts/authContext"

const App = () => {
    const [user, setUser] = useState([])
    const [votes, setVotes] = useState([])

    useEffect(() => {
        fetchUser()
    }, [])

    const fetchUser = async () => {
        try {
            const jwt = localStorage.getItem("token")
            const user = jwtDecode(jwt)
            console.log(user)
            //setUser(user)
            setUser(await getUserWithUsername(user.username))
        } catch (error) {
            console.log("user", error)
        }
    }

    const setUserChild = (data) => {
        setUser(data)
    }
    return (
        <HashRouter>
            <AuthContext.Provider value={[user, setUser]}>
                <Navbar user={user} />
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    theme="dark"
                />
                <div className="container page-content pt-5">
                    <Switch>
                        <PrivateRoute
                            path="/articles/:id/edit"
                            exact
                            component={ArticleEdit}
                        />
                        <PrivateRoute
                            path="/articles/new"
                            exact
                            component={ArticleNew}
                            user={user}
                        />
                        <Route
                            path="/article/:id"
                            exact
                            render={(props) => (
                                <ArticleDetail {...props} user={user} />
                            )}
                        />
                        <Route
                            path="/tag/:label"
                            exact
                            render={(props) => (
                                <TagArticles {...props} user={user} />
                            )}
                        />
                        <Route
                            path="/user/:username/favorites"
                            exact
                            render={(props) => (
                                <UserFavorites {...props} user={user} />
                            )}
                        />
                        <Route
                            path="/user/:username/articles"
                            exact
                            render={(props) => (
                                <UserArticles {...props} user={user} />
                            )}
                        />
                        <Route
                            path="/test"
                            exact
                            render={(props) => <Test {...props} user={user} />}
                        />
                        <Route
                            path="/profile"
                            exact
                            render={(props) => (
                                <UserSettings
                                    {...props}
                                    user={user}
                                    setUser={setUserChild}
                                />
                            )}
                        />
                        <Route
                            path="/login"
                            exact
                            render={(props) => <Login {...props} />}
                        />
                        <Route
                            path="/register"
                            exact
                            render={(props) => <Register {...props} />}
                        />
                        <Route path="/about" exact component={About} />
                        <Route
                            path="/"
                            exact
                            render={(props) => (
                                <HomePage {...props} user={user} />
                            )}
                        />
                        <Route path="/not-found" component={NotFound} />
                        <Redirect to="/not-found" />
                    </Switch>
                </div>
                <Footer />
            </AuthContext.Provider>
        </HashRouter>
    )
}

const rootElement = document.querySelector("#app")
ReactDOM.render(<App />, rootElement)
