const fs = require('fs');
const data = {
    auth: require('../models/authModel.json'),
    setUsers: function (newData) {
        this.users = newData;
    },
};
const bcrypt = require('bcrypt');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const ROLES_LIST = require('../config/roleList');

const registerUser = async (req, res, next) => {
    const { username, pwd } = req.body;
    // console.log(data.auth, data.auth[data.auth.length - 1].id + 1);

    if (!username || !pwd) {
        res.status(400).json({ message: 'Field cannot be empty!' });
    }

    const foundUserIndex = data.auth.findIndex(
        (user) => user.username === username
    );

    if (foundUserIndex !== -1) {
        res.status(409).json({ message: 'User already exist!' });
    }

    try {
        const user = {
            id: data.auth.length > 0 ? data.auth[data.auth.length - 1].id + 1 : 1,
            username: username,
            pwd: bcrypt.hashSync(pwd, 12),
            roles: { user: ROLES_LIST.USER },
        };

        await fs.promises.writeFile(
            path.join(__dirname, '..', 'models', 'authModel.json'),
            JSON.stringify([...data.auth, user])
        );
        //console.log(user);
        res.status(201).json({
            message: 'User Created!',
            userData: { username, roles: user.roles },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const loginUser = async (req, res, next) => {
    const { username, pwd } = req.body;
    // console.log('here');

    if (!username || !pwd) {
        res.status(400).json({ message: 'Field cannot be empty!' });
    }

    const foundUser = data.auth.find((user) => user.username === username);
    // console.log(foundUser);

    if (!foundUser) {
        return res.sendStatus(401);
    }

    const roles = foundUser.roles;
    const rolesValue = Object.values(roles);

    try {
        const match = await bcrypt.compare(pwd, foundUser.pwd);
        // console.log(match);
        if (match) {
            const accessToken = jwt.sign(
                {
                    username,
                    roles: rolesValue,
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );

            const refreshToken = jwt.sign(
                { username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );

            const authUser = {
                ...foundUser,
                refreshToken,
            };

            // console.log(accessToken, refreshToken);

            const unsortedArrAuth = [
                ...data.auth.filter((user) => user.username !== username),
                authUser,
            ];
            const sortedArrAuth = unsortedArrAuth.sort((a, b) => {
                a.id > b.id ? -1 : a.id < b.id ? 1 : 0;
            });

            await fs.promises.writeFile(
                path.join(__dirname, '..', 'models', 'authModel.json'),
                JSON.stringify(sortedArrAuth)
            );

            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
            });
            res.json({ message: 'User logged in!', accessToken });
        } else {
            return res.sendStatus(401);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);

    const foundUser = data.auth.find((user) => user.refreshToken === cookies.jwt);

    if (!foundUser) return res.sendStatus(403);

    const roles = foundUser.roles;
    const rolesValue = Object.values(roles);

    jwt.verify(cookies.jwt, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || decoded.username !== foundUser.username)
            return res.sendStatus(403);
        const accessToken = jwt.sign(
            {
                username: foundUser.username,
                roles: rolesValue,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        );

        res.json({ accessToken });
    });
};

const handleLogOut = async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(401);
    }

    const foundUser = data.auth.find((user) => user.refreshToken === cookies.jwt);
    // console.log("logout", foundUser);

    if (!foundUser) {
        return res.sendStatus(401);
    }

    res.clearCookie('jwt', { httpOnly: true });
    const newUser = {
        ...foundUser,
        refreshToken: '',
    };
    const otherUser = [
        ...data.auth.filter((user) => user.refreshToken !== cookies.jwt),
    ];
    const authUser = [...otherUser, newUser].sort((a, b) => {
        a.id > b.id ? -1 : a.id < b.id ? 1 : 0;
    });
    // console.log(authUser);
    await fs.promises.writeFile(
        path.join(__dirname, '..', 'models', 'authModel.json'),
        JSON.stringify(authUser)
    );

    res.sendStatus(204);
};

module.exports = { registerUser, loginUser, handleRefreshToken, handleLogOut };
