const data = {
    users: require('../models/usersModel'),
    setUser: (newData) => data.users = newData
};

const getUsers = (req, res) => {
    res.json({ users: data.users });
};

const addUser = (req, res) => {
    if (!req.body.firstName || !req.body.lastName) {
        res.status(400).json({
            message: "User cannot be empty"
        });
    }

    const user = {
        id: data.users ? data.users[data.users.length - 1].id + 1 : 1,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    };

    const usersArray = [...data.users, user];
    data.setUser(usersArray);

    res.status(201).json({
        ...user
    });
};

const updateUser = (req, res) => {
    const userFound = data.users.find(user => user.id === req.body.id);

    if (!userFound) {
        res.status(400).json({ message: 'User not found!' });
    }

    if (req.body.firstName)
        userFound.firstName = req.body.firstName;
    if (req.body.lastName)
        userFound.lastName = req.body.lastName;

    const unsortedUsersArray = [...data.users.filter(user => user.id !== req.body.id), userFound];
    const sortedUserArray = unsortedUsersArray.sort((a, b) => a.id > b.id ? 1 : b.id > a.id ? -1 : 0);
    data.setUser(sortedUserArray);

    res.status(200).json({
        ...userFound
    });
};

const deleteUser = (req, res) => {
    const foundUserIndex = data.users.findIndex(user => user.id === req.body.id);

    if (foundUserIndex === -1)
        res.status(400).json({ message: 'User not found!' });

    const filteredUser = [...data.users.filter(user => user.id !== req.body.id)];
    data.setUser(filteredUser);

    res.status(204).json({
        id: req.body.id
    });
};

module.exports = { getUsers, addUser, updateUser, deleteUser };