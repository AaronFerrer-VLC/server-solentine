const getRoles = (req, res, next) => {
    const roles = ['admin', 'user', 'superadmin']
    res.json(roles)
}

module.exports = {
    getRoles
}