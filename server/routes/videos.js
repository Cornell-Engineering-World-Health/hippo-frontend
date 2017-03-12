var express = require('express')
var router = express.Router()
var OpenTok = require('opentok')
var opentok = new OpenTok(process.env.OPENTOK_KEY, process.env.OPENTOK_SECRET_KEY)

var Videocall = require('../models/videocall')
var videoServices = require('../services/videos')

var User = require('../models/user')

var Errors = require('../resources/errors')
// ROUTE - create a session, return session and token
/**
 * @swagger
 * /videos:
 *   post:
 *     description: Create a Session. Currently nothing required in body
 *     tags: [Session]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Session name
 *         in: body
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: Session successfully created
 *         schema:
 *           type: object
 *           $ref: '#/definitions/newSession'
 *       500:
 *         description: 500 Internal Server Error
 *         schema:
 *           type: object
 *           $ref: '#/definitions/Error'
 */
router.post('/', function (req, res) {
  // create sessionId
  opentok.createSession(function (err, session) {
    if (err) {
      res.status(500).json(Errors.INTERNAL_OPENTOK(err))
      return
    }
    var video = new Videocall()
    videoServices.generateChatName(function (err, name) {
      if (err) {
        res.status(500).json(Errors.INTERNAL_READ(err))
        return
      }
      video.name = name
      video.sessionId = session.sessionId
      video.datetime = Date.now()
      video.participants = []

      var tokenOptions = {}
      tokenOptions.role = 'publisher'
      // Generate a token.
      var token = opentok.generateToken(session.sessionId, tokenOptions)

      video.save(function (err, video) {
        if (err) {
          res.status(500).json(Errors.INTERNAL_WRITE(err))
          return
        }
        video = video.toObject()
        video.tokenId = token
        res.json({ message: 'New session added!', data: video })
      })
    })
  })
})

// ROUTE - takes a code, and returns session and token
/**
 * @swagger
 * /videos/{video_name}:
 *   get:
 *     tags: [Session]
 *     description: Returns a Single Session
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: video_name
 *         description: Session's Name
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A single session returned
 *         schema:
 *           $ref: '#/definitions/Session'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           $ref: '#/definitions/Error'
 */
router.get('/:video_name', function (req, res) {
  Videocall
  .findOne({ name: req.params.video_name })
  .populate('participants')
  .exec(function (err, video) {
    if (err) {
      res.status(500).json(Errors.INTERNAL_READ(err))
    }
    if (video == null) {
      res.status(404).json(Errors.CALL_NOT_FOUND(req.params.video_name))
    } else {
      var tokenOptions = {}
      tokenOptions.role = 'publisher'

      // Generate a token.
      var token = opentok.generateToken(video.sessionId, tokenOptions)
      video = video.toObject()
      video.tokenId = token
      res.json(video)
    }
  })
})

// ROUTE - takes a code, and deletes session
/**
 * @swagger
 * /videos/{video_name}:
 *   delete:
 *     tags: [Session]
 *     description: Deletes a Single Session
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: video_name
 *         description: Session's Name
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A single session deleted.
 *         schema:
 *           $ref: '#/definitions/deleteSuccessMessage'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           $ref: '#/definitions/Error'
 */

router.delete('/:video_name', function (req, res) {
  Videocall.findOneAndRemove({ name: req.params.video_name }, function (err, video) {
    if (err) {
      res.status(500).json(Errors.INTERNAL_READ(err))
      return
    }
    if (video == null) {
      res.status(404).json(Errors.CALL_NOT_FOUND(req.params.video_name))
    } else {
      res.json({
        message: 'session with code: \'' + req.params.video_name + '\' has been deleted.',
        name: req.params.video_name
      })
    }
  })
})

// ROUTE - takes a caller id of a user and a calling id and returns a new call
/**
 * @swagger
 * /videos/{caller_id}/users/{calling_id}:
 *   post:
 *     tags: [Session]
 *     description: Returns a Single Session with two participants
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: caller_id
 *         description: Id of user creating call
 *         in: path
 *         required: true
 *         type: string
 *       - name: calling_id
 *         description: Id of the user that is being called
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A single session returned
 *         schema:
 *           $ref: '#/definitions/Session'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           $ref: '#/definitions/Error'
 */
router.post('/:caller_id/users/:calling_id', function (req, res) {
  opentok.createSession(function (err, session) {
    if (err) {
      return res.status(500).json(Errors.INTERNAL_OPENTOK(err))
    }

    var video = new Videocall()
    User.findOne({ userId: req.params.caller_id }, function (err, caller) {
      if (err) {
        return res.status(500).json(Errors.INTERNAL_READ(err))
      } else if (caller == null) {
        return res.status(404).json(Errors.USER_NOT_FOUND(req.params.caller_id))
      }
      User.findOne({ userId: req.params.calling_id }, function (err, calling) {
        if (err) {
          return res.status(500).json(Errors.INTERNAL_READ(err))
        } else if (calling == null) {
          return res.status(404).json(Errors.USER_NOT_FOUND(req.params.calling_id))
        }

        videoServices.generateChatName(function (err, name) {
          if (err) {
            return res.status(500).json(Errors.INTERNAL_READ(err))
          }
          video.name = name
          video.sessionId = session.sessionId
          video.datetime = Date.now()
          video.participants = [ caller._id, calling._id ]

          video.save(function (err, video) {
            if (err) {
              return res.status(500).json(Errors.INTERNAL_WRITE(err))
            }

            var tokenOptions = {}
            tokenOptions.role = 'publisher'
            // Generate a token.
            var token = opentok.generateToken(session.sessionId, tokenOptions)

            video.populate('participants', function (err) {
              if (err) {
                return res.status(500).json(Errors.INTERNAL_READ(err))
              }
              video = video.toObject()
              video.tokenId = token
              res.json({ message: 'Calling user', data: video })
            })
          })
        })
      })
    })
  })
})

module.exports = router
