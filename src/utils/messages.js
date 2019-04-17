const generateMessage = (text, username) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage
}