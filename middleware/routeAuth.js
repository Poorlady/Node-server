const handleRoutes = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.sendStatus(401);
        const rolesArr = [...allowedRoles];
        // console.log(rolesArr, req.roles);
        const result = req.roles.map(role => rolesArr.includes(role)).find(result => result === true);
        if (!result) return res.sendStatus(401);
        next();
    };
};

module.exports = handleRoutes;