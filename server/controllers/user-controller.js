const auth = require('../auth')
const User = require('../models/user-model')
const bcrypt = require('bcryptjs')

getLoggedIn = async (req, res) => {
    auth.verify(req, res, async function () {
        const loggedInUser = await User.findOne({ _id: req.userId });
        return res.status(200).json({
            loggedIn: true,
            user: {
                firstName: loggedInUser?.firstName,
                lastName: loggedInUser?.lastName,
                userName: loggedInUser?.userName,
                isGuest: (loggedInUser?.userName === "Guest")
            }
        }).send();
    })
}

registerUser = async (req, res) => {
    try {
        const { firstName, lastName, userName, email, password, passwordVerify } = req.body;
        if (!firstName || !lastName || !email || !password || !passwordVerify) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter the same password twice."
                })
        }
        if(userName === "Community" || userName === "Guest") {
            return res
                .status(400)
                .json({
                    errorMessage: "An account with this User Name already exists."
                })
        }
        if(email === "community@top5lister.com" || email === "guestuser@top5lister.com") {
            return res
                .status(400)
                .json({
                    errorMessage: "An account with this email address already exists."
                })
        }
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        }

        const existingUser2 = await User.findOne({ userName: userName });
        if (existingUser2) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this User Name already exists."
                })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName, lastName, userName, email, passwordHash
        });
            await newUser.save().then(() => {
                return res.status(200).json({
                    success: true,
                    message: 'User has been registered!'
                })
            }).catch(() => {
                return res.status(404).json({
                    success: false,
                    message: 'Failed to register user'
                })
            });

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

loginUser = async (req, res) => {
    try{
        const {userName, password} = req.query;
        if(userName === "Community" || userName === "Guest"){
            return res.status(400).json({ errorMessage: "You cannot login with this userName"});
        }
        const foundUser = await User.findOne({userName: userName});
        if(!foundUser){
            return res.status(400).json({ errorMessage: "A User with the username provided does not exist."});
        }
        const match = await bcrypt.compare(password, foundUser.passwordHash);
        if(match){
            const token = auth.signToken(foundUser); 

            await res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            }).status(200).json({
                success: true, 
                user: {
                    firstName: foundUser.firstName,
                    lastName: foundUser.lastName,
                    userName: foundUser.userName,
                    isGuest: false
                }
            }).send(); 
        }
        else{
            return res.status(400).json({ errorMessage: "Wrong password entered."});
        }
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

loginGuest = async (req, res) => {
    try{
        const foundGuest = await User.findOne({userName: "Guest"});
        if(!foundGuest){
            const newUser = new User({
                firstName: "Guest", lastName:"User", userName: "Guest", email: "guestuser@top5lister.com", passwordHash:"GuestUser"
            });
            const savedUser = await newUser.save();
            const token = auth.signToken(savedUser);

            await res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            }).status(200).json({
                success: true,
                user: {
                    firstName: savedUser.firstName,
                    lastName: savedUser.lastName,
                    userName: savedUser.userName,
                    isGuest: true
                }
            }).send();
        }
        else{
            const token = auth.signToken(foundGuest); 

            await res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            }).status(200).json({
                success: true, 
                user: {
                    firstName: foundGuest.firstName,
                    lastName: foundGuest.lastName,
                    userName: foundGuest.userName,
                    isGuest: true
                }
            }).send();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

logoutUser = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 0 
    }); 
    return res.status(200).json({success: true}); 
}

module.exports = {
    getLoggedIn,
    registerUser,
    loginUser,
    loginGuest,
    logoutUser
}