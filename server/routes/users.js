var express = require('express')
var router = express.Router()
var User = require('../models/user')
var Errors = require('../resources/errors')

// ROUTE - create a session, return session and token
/**
 * @swagger
 * /users:
 *   post:
 *     description: Creates a User with an auto-incremented user id
 *     tags: [Users]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Basuc user information
 *         in: body
 *         required: true
 *         type: string
 *         schema:
 *            $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: User successfully created
 *         schema:
 *           type: object
 *           $ref: '#/definitions/UserResponse'
 *       500:
 *         description: 500 Internal Server Error
 *         schema:
 *           type: object
 *           $ref: '#/definitions/Error'
 */
router.post('/', function (req, res) {
  var user = new User()
  user.firstName = req.body.firstName
  user.lastName = req.body.lastName
  user.email = req.body.email
  user.calls = []
  user.contacts = []

  user.save(function (err) {
    if (err) {
      return res.status(500).json(Errors.INTERNAL_WRITE(err))
    }
    res.json({ message: 'New user added!', data: user })
  })
})

// ROUTE - takes a code, and returns session and token
/**
 * @swagger
 * /users/{user_id}:
 *   get:
 *     tags: [Users]
 *     description: Returns a Single User based on userId
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user_id
 *         description: User's unique id nummber
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A single user returned
 *         schema:
 *           $ref: '#/definitions/UserResponse'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           $ref: '#/definitions/Error'
 */
router.get('/:user_id', function (req, res) {
  User
  .findOne({ userId: req.params.user_id })
  .populate('contacts calls')
  .exec(function (err, user) {
    if (err) {
      return res.status(500).json(Errors.INTERNAL_READ(err))
    }
    if (user == null) {
      return res.status(404).json(Errors.USER_NOT_FOUND(req.params.user_id))
    }
    res.json(user)
  })
})

module.exports = router
