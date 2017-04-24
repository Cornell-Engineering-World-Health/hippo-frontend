app.controller('UserCtrl', ['$scope', '$log', '$http', '$q', '$location', '$timeout', 'User', 'UserService', 'VideoService', 'UserVideoService',
  function ($scope, $log, $http, $q, $location, $timeout, User, UserService, VideoService, UserVideoService) {

  var baseURL = UserService.baseUrlAPI
  $scope.session = {
    invitedUserIds: [],
    startTime: "null",
    endTime: "null"
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function makeUserDict(allUsers) {
    dict = {}
    for (var i = allUsers.length - 1; i >= 0; i--) {
      dict[allUsers[i].userId] = allUsers[i].firstName + ' ' + allUsers[i].lastName
    }
    return dict
  }

  function checkActiveSession(session) {
    var d = new Date()
    if(session.endTime > d.toISOString() || session.active){
      return true
    } else {
	  console.log(session)
	  console.log("A session you were in expired at " + session.endTime)
	  
	  var test = session.participants
	  test = test.map(function(user) {
		return user.firstName + " " + user.lastName
	  })
	  test = test.filter(function(user) {
		return user != $scope.user.firstName + ' ' + $scope.user.lastName
	  })
      $scope.notifications.push("You missed the session " + session.name + " with " + test.join(', '))
	  console.log($scope.notifications)
      return false
    }
  }

  function checkSelf(user) {
    return user.email != $scope.user.email
  }

  function parseParticipants(session) {
    var particp = session.participants
    particp = particp.map(function(user) {
      return user.firstName + " " + user.lastName
    })
    particp = particp.filter(function(user) {
      return user != $scope.user.firstName + ' ' + $scope.user.lastName
    })
    session.participants = particp.join(', ')
  }

  function parseUsers(cdr) {
    var promises = cdr.userIds.map(function (userId) {
        return User.getUser(userId)
          .then(function (response) {
            // console.log(response)
            return response
          })
      })
    // $q.all(promises).then(function (res) {
    //   console.log(res)
    //   return res
    // })
    return $q.all(promises)
  }

  function parseConnections(cdr) {
    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]

    var date = new Date(null)
    date.setSeconds(parseInt(cdr.callDuration)/1000.0)
    cdr.callDuration = date.toISOString().substr(11, 8)

    cdr.userIds = cdr.userIds.map(function (_id) {
      return $scope.userDict[parseInt(_id)]
    })

    cdr.userIds = cdr.userIds.filter(function (name) {
      return name.trim() != $scope.user.firstName + ' ' + $scope.user.lastName
    })
    cdr.userIds = cdr.userIds.join(', ')

    cdr.connections = cdr.connections.map(function (conn) {
      connArr = conn.split(",")
      var dateObj = new Date(connArr[2])
      var month = dateObj.getUTCMonth() + 1
      var day = dateObj.getUTCDate()
      var year = dateObj.getUTCFullYear()
      var hours = dateObj.getUTCHours()
      var minutes = dateObj.getUTCMinutes()
      var seconds = dateObj.getUTCSeconds()
      connArr[2] = monthNames[month] + " " + day + " " + hours + ":" + minutes
      return $scope.userDict[parseInt(connArr[1])] + ': ' + connArr[2]
    })
    if (cdr.connections.length == 0) {
      cdr.connections = 'N/A'
    }
    else {
      cdr.connections = cdr.connections.join(", ")
    }
    cdr.disconnections = cdr.disconnections.map(function (conn) {
      connArr = conn.split(",")
      var dateObj = new Date(connArr[2])
      var month = dateObj.getUTCMonth() + 1
      var day = dateObj.getUTCDate()
      var year = dateObj.getUTCFullYear()
      var hours = dateObj.getUTCHours()
      var minutes = dateObj.getUTCMinutes()
      var seconds = dateObj.getUTCSeconds()
      connArr[2] = monthNames[month] + " " + day + " " + hours + ":" + minutes
      return $scope.userDict[parseInt(connArr[0])] + ': ' + connArr[2]
    })
    if (cdr.disconnections.length == 0) {
      cdr.disconnections = 'N/A'
    }
    else {
      cdr.disconnections = cdr.disconnections.join(", ")
    }

    cdr.streamCreations = cdr.streamCreations.map(function (conn) {
      connArr = conn.split(",")
      var dateObj = new Date(connArr[1])
      var month = dateObj.getUTCMonth() + 1
      var day = dateObj.getUTCDate()
      var year = dateObj.getUTCFullYear()
      var hours = dateObj.getUTCHours()
      var minutes = dateObj.getUTCMinutes()
      var seconds = dateObj.getUTCSeconds()
      connArr[1] = monthNames[month] + " " + day + " " + hours + ":" + minutes
      return $scope.userDict[parseInt(connArr[0])] + ": " + connArr[1]
    })
    if (cdr.streamCreations.length == 0) {
      cdr.streamCreations = 'N/A'
    }
    else {
      cdr.streamCreations = cdr.streamCreations.join(", ")
    }

    cdr.frameRates = cdr.frameRates.map(function (conn) {
      connArr = conn.split(",")
      var dateObj = new Date(connArr[2])
      var month = dateObj.getUTCMonth() + 1
      var day = dateObj.getUTCDate()
      var year = dateObj.getUTCFullYear()
      var hours = dateObj.getUTCHours()
      var minutes = dateObj.getUTCMinutes()
      var seconds = dateObj.getUTCSeconds()
      connArr[2] = monthNames[month] + " " + day + " " + hours + ":" + minutes
      return $scope.userDict[parseInt(connArr[0])] + ": " + connArr[1] + " at " + connArr[2]
    })
    if (cdr.frameRates.length == 0) {
      cdr.frameRates = 'N/A'
    }
    else {
      cdr.frameRates = cdr.frameRates.join(", ")
    }

    cdr.hasAudios = cdr.hasAudios.map(function (conn) {
      connArr = conn.split(",")
      var dateObj = new Date(connArr[2])
      var month = dateObj.getUTCMonth() + 1
      var day = dateObj.getUTCDate()
      var year = dateObj.getUTCFullYear()
      var hours = dateObj.getUTCHours()
      var minutes = dateObj.getUTCMinutes()
      var seconds = dateObj.getUTCSeconds()
      connArr[2] = monthNames[month] + " " + day + " " + hours + ":" + minutes
      if (connArr[1].includes('true')) {
        connArr[1] = 'Yes'
      }
      else {
        connArr[1] = 'No'
      }
      return $scope.userDict[parseInt(connArr[0])] + ": " + connArr[1] + " at " + connArr[2]
    })
    if (cdr.hasAudios.length == 0) {
      cdr.hasAudios = 'N/A'
    }
    else {
      cdr.hasAudios = cdr.hasAudios.join(", ")
    }

    cdr.hasVideos = cdr.hasVideos.map(function (conn) {
      connArr = conn.split(",")
      var dateObj = new Date(connArr[2])
      var month = dateObj.getUTCMonth() + 1
      var day = dateObj.getUTCDate()
      var year = dateObj.getUTCFullYear()
      var hours = dateObj.getUTCHours()
      var minutes = dateObj.getUTCMinutes()
      var seconds = dateObj.getUTCSeconds()
      connArr[2] = monthNames[month] + " " + day + " " + hours + ":" + minutes
      if (connArr[1].includes('true')) {
        connArr[1] = 'Yes'
      }
      else {
        connArr[1] = 'No'
      }
      return $scope.userDict[parseInt(connArr[0])] + ": " + connArr[1] + " at " + connArr[2]
    })
    if (cdr.hasVideos.length == 0) {
      cdr.hasVideos = 'N/A'
    }
    else {
      cdr.hasVideos = cdr.hasVideos.join(", ")
    }

    cdr.videoTypes = cdr.videoTypes.map(function (conn) {
      connArr = conn.split(",")
      var dateObj = new Date(connArr[2])
      var month = dateObj.getUTCMonth() + 1
      var day = dateObj.getUTCDate()
      var year = dateObj.getUTCFullYear()
      var hours = dateObj.getUTCHours()
      var minutes = dateObj.getUTCMinutes()
      var seconds = dateObj.getUTCSeconds()
      connArr[2] = monthNames[month] + " " + day + " " + hours + ":" + minutes
      connArr[1] = capitalizeFirstLetter(connArr[1].trim())
      return $scope.userDict[parseInt(connArr[0])] + ": " + connArr[1] + " at " + connArr[2]
    })
    if (cdr.videoTypes.length == 0) {
      cdr.videoTypes = 'N/A'
    }
    else {
      cdr.videoTypes = cdr.videoTypes.join(", ")
    }

  }

  $scope.setSessionName = function(session_name) {
    UserVideoService.set(session_name)
  }


  // Returns user information for the User profile
  $scope.getSelf = function() {
    User.getSelf()
        .then(function (response) {
          $scope.user = response.data
          $scope.userSessions = response.data.calls
          $scope.userSessions = $scope.userSessions.filter(checkActiveSession)
          // console.log($scope.user)
          $scope.userSessions.map(parseParticipants)
          $scope.getAllUsers()
          $scope.getCDR()
        })
        .catch(function (error) {
            console.log(error)
            return error
        })
  }

  $scope.getAllUsers = function() {
    User.getAllUsers()
    .then(function (response) {
      $scope.allUsers = response.data.users
      $scope.userDict = makeUserDict($scope.allUsers)
      $scope.allUsers = $scope.allUsers.filter(checkSelf)

    })
    .catch(function (error) {
        console.log(error)
        return error
    })
  }

  $scope.getCDR = function() {
    User.getCDR($scope.user.userId)
    .then(function (response) {
      $scope.cdrs = response.data
      var deferreds = $scope.cdrs.map(parseUsers)
      // console.log(deferreds)
      // var userDict = {}
      // for (var i = 0; i < deferreds.length; i++) {
      //   var data = deferreds[i].$$state.value
      //   console.log(data)
      //   userDict[val[$$state].value[0].data.userId] = val[$$state].value[0].data.firstName + ' ' + val.$$state.value[0].data.lastName
      // }
      // console.log(userDict)
      $scope.cdrs.map(parseConnections)
    })
    .catch(function (error) {
      console.log(error)
      return error
    })
  }

  $scope.createSession = function() {
    $scope.session.invitedUserIds = $scope.session.invitedUserIds.map(Number);
    $scope.session.startTime = $scope.session.startTime._d
    $scope.session.endTime = $scope.session.endTime._d
    VideoService.createSession(JSON.stringify($scope.session))
    .then(function (response) {
      console.log("Session Created")
      $timeout(function() {
        $location.path('/user').replace()
      })
    })
    .catch(function (error) {
        console.log(error)
        return error
    })
  }
  $scope.getSelf()
  // $scope.getCDR()
}])
