var errors = {
  INTERNAL_OPENTOK: function (err) {
    return {
      code: '500 Internal Server Error',
      detail: 'Internal Opentok error while creating a new session.',
      error: err
    }
  },
  INTERNAL_READ: function (err) {
    return {
      code: '500 Internal Server Error',
      detail: 'Internal Mongoose error while reading from database.',
      error: err
    }
  },
  INTERNAL_WRITE: function (err) {
    return {
      code: '500 Internal Server Error',
      detail: 'Internal Mongoose error while writing to database.',
      error: err
    }
  },
  USER_NOT_FOUND: function (id) {
    return {
      code: '404 Not Found',
      detail: 'Requested user with id: ' + id + ' does not exist.'
    }
  },
  CALL_NOT_FOUND: function (name) {
    return {
      code: '404 Not Found',
      detail: 'Requested video name: \'' + name + '\' does not exist.'
    }
  }
}

module.exports = errors
