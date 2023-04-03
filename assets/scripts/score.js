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
