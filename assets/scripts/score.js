import { updateArticle } from "../services/articleAPI"
import { updateComment } from "../services/commentAPI"
import { updateUser } from "../services/userAPI"
import { newVote, updateVote } from "../services/voteAPI"

export const handleScore = (item, action, data) => {
    console.log("handlescore data", data)
    if (action === "-") {
        if (!item.votes[0].isDown) {
            data.score -= 1
            data.author.karma -= 1
            item.votes[0].isDown = true
            if (item.votes[0].isUp) {
                data.score -= 1
                data.author.karma -= 1
                item.votes[0].isUp = false
            }
        } else {
            data.score += 1
            data.author.karma += 1
            item.votes[0].isDown = false
        }
    } else {
        if (!item.votes[0].isUp) {
            data.score += 1
            data.author.karma += 1
            item.votes[0].isUp = true
            if (item.votes[0].isDown) {
                data.score += 1
                data.author.karma += 1
                item.votes[0].isDown = false
            }
        } else {
            data.score -= 1
            data.author.karma -= 1
            item.votes[0].isUp = false
        }
    }
}

export const handleNewScore = async (action, data) => {
    if (action === "-") {
        data.down = true
        data.up = false
        data.score -= 1
        data.author.karma -= 1
    } else {
        data.down = false
        data.up = true
        data.score += 1
        data.author.karma += 1
    }
}

export async function handleSubmitNewScore(data, datas, setDatas, user, setUser, type = "article") {
    //Reformat
    const userId = user["@id"]
    const articleId = data["@id"]
    const author = data.author
    //Submit
    try {
        await newVote({
            user: userId,
            [type]: articleId,
            isDown: data.down,
            isUp: data.up,
        }).then((response) => {
            //setUser
            const newVoteId = response.data.id
            const userNewVotes = [...user.votes]
            userNewVotes.push(`/api/votes/${newVoteId}`)
            setUser((prevState) => ({
                ...prevState,
                votes: userNewVotes,
            }))
            if (user.id === data.author.id) {
                setUser((prevState) => ({
                    ...prevState,
                    karma: data.author.karma,
                }))
            }

            //setArticles
            const newVote = {
                ["@id"]: `/api/votes/${newVoteId}`,
                id: newVoteId,
                isUp: response.data.isUp,
                isDown: response.data.isDown,
                user: {
                    ["@id"]: userId,
                },
            }
            data.votes.push(newVote)
            setDatas(datas)
        })
        if (type === "article") {
            await updateArticle(data.id, { score: data.score })
        } else if (type === "comment") {
            await updateComment(data.id, { score: data.score })
        }
        await updateUser(author.id, {
            karma: author.karma,
        })
    } catch (error) {
        console.log(error)
    }
}

export async function handleSubmitScore(data, datas, setDatas, user, setUser, type = "article") {
    //Reformat
    const voteData = { ...data.votes[0] }
    voteData.user = voteData.user["@id"]

    //Submit
    //console.log("submit datas", datas)
    setDatas(datas)
    if (user.id === data.author.id) {
        setUser((prevState) => ({
            ...prevState,
            karma: data.author.karma,
        }))
    }

    console.log("votes", voteData)
    try {
        if (type === "article") {
            await updateArticle(data.id, { score: data.score })
        } else if (type === "comment") {
            await updateComment(data.id, { score: data.score })
        }
        await updateVote(data.votes[0].id, voteData)
        await updateUser(data.author.id, {
            karma: data.author.karma,
        })
    } catch (error) {
        console.log(error)
    }
}
