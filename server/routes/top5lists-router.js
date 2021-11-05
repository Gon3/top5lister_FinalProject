const auth = require('../auth')
const express = require('express')
const Top5ListController = require('../controllers/top5list-controller')
const UserController = require('../controllers/user-controller')
const router = express.Router()

router.post('/top5list', auth.verify, Top5ListController.createTop5List)
router.put('/top5list/:id/:email', auth.verify, Top5ListController.updateTop5List)
router.delete('/top5list/:id/:email', auth.verify, Top5ListController.deleteTop5List)
router.get('/top5list/:id/:email', auth.verify, Top5ListController.getTop5ListById)
router.get('/top5lists/:email', auth.verify, Top5ListController.getTop5Lists)
router.get('/top5listpairs/:email', auth.verify, Top5ListController.getTop5ListPairs)

router.post('/register', UserController.registerUser)
router.get('/loggedIn', UserController.getLoggedIn)
router.get('/login/', UserController.loginUser)
router.get('/logout/', UserController.logoutUser)
module.exports = router