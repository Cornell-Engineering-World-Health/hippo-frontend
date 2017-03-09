var app = angular.module('myApp', ['opentok', 'ngRoute'])

app.config(function ($routeProvider) {
  $routeProvider
    .when('/video', { templateUrl: 'index.html' })
    .when('/', { templateUrl: 'index.html' })
    .when('/home', { templateUrl: 'index.html' })
    .when('/videocall', { templateUrl: 'video.html' })
    // .otherwise( { redirectTo: '/video' } );
})

app.factory('sessionFactory', ['$http', function ($http) {
  var baseURL = 'https://ewh-hippo.herokuapp.com/api'
  var service = {
    createSession: function (sessionData) {
      // TODO: why are we exposing this in post url; no need
      return $http.post(baseURL + '/videos/' + sessionData.caller_id + '/users/' + sessionData.calling_id, sessionData)
         .then(function (response) {
           return response.data
         })
        .catch(function (error) {
          console.error('Failed post. Error: ' + error.data)
        })
    },
    getNewToken: function (session_name) {
      return $http.get(baseURL + '/videos/' + session_name)
        .then(function (response) {
          return response.data
        })
        .catch(function (error) {
          console.error('Failed to get token for session ' + session_name + '. Error: ' + error.data)
        })
    },
    deleteSession: function (session_name) {
      return $http.delete(baseURL + '/videos/' + session_name)
        .then(function (response) {
          return response.data
        })
        .catch(function (error) {
          console.error('Failed to delete session. Error: ' + error.data)
        })
    }
      // try {
      //   $http.delete(baseURL + '/videos/' + session_name)
      // }
      // catch (error) {
      //   if(error.status == '404') {
      //       console.log('Session already deleted.')
      //       return
      //   }
      //   console.error('Failed to delete session ' + session_name + '. Error: ' + error.data)
      // }
    }
  return service
  }
])

app.controller('UserController', ['$scope', '$log', '$http', 'sessionFactory', function ($scope, $log, $http, sessionFactory) {

  var baseURL = 'https://ewh-hippo.herokuapp.com/api'

  // Returns user information for the User profile
  $scope.getUser = function(user_id) {
    $http.get(baseURL + '/users/' + user_id)
        .then(function (response) {
            return response.data
        })
        .catch(function (error) {
            console.log('Failed to get user ' + user_id + '. Error: ' + error.data)
            return error
        })
  }
  // Returns all available sessions given user_id
  $scope.getAllSessionsForUser = function(user_id) {
      $http.get(baseURL + '/users/' + user_id)
        .then(function (response) {
            console.log(response.data.calls)
            return response.data.calls
        })
        .catch(function (error) {
            console.log('Failed to get sessions for user ' + user_id + '. Error: ' + error.data)
            return error.data
        })
  }
  // Hard coded for user 8 until OAth integration, but isn't working
  $scope.userSessions = $scope.getAllSessionsForUser(8)
}])

app.controller('VideoController', ['$scope', '$http', '$window', '$log', 'OTSession', 'sessionFactory', 
  function ($scope, $http, $window, $log, OTSession, sessionFactory) {
  
  //console.log(OTSession)
  $scope.streams = OTSession.streams
  $scope.connections = OTSession.connections
  $scope.publishing = false
  $scope.archiveId = null
  $scope.archiving = false
  $scope.connected = false
  $scope.reconnecting = false
  $scope.leaving = false
  $scope.deleted = false

  var apiKey = '45786882'

  $scope.getVideoByName = function (session_name) {
    if ($scope.session) {
      $scope.session.disconnect()
    }

    sessionFactory.getNewToken(session_name)
      .then(function (result_token) {
        console.log(result_token)

        OTSession.init(apiKey, result_token.sessionId, result_token.tokenId, function(err, session) {
          if(err) {
            console.log('sessionId: ' + result_token.sessionId + ' tokenId: ' + result_token.tokenId)
            $scope.$broadcast('otError', {message: 'initialize session error'})
            return
          }
          
          $scope.session = session
          $scope.sessionName = session_name

          var connectDisconnect = function (connected) {
            $scope.$apply(function () {
              $scope.connected = connected
              $scope.reconnecting = false
              if (!connected) {
                $scope.publishing = false
              }
            })
          }

          var reconnecting = function (isReconnecting) {
            $scope.$apply(function () {
              $scope.reconnecting = isReconnecting
            })
          }

          if ((session.is && session.is('connected')) || session.connected) {
            connectDisconnect(true)
          }

          $scope.session.on('sessionConnected', connectDisconnect.bind($scope.session, true))
          $scope.session.on('sessionDisconnected', connectDisconnect.bind($scope.session, false))

          $scope.session.on('sessionReconnecting', reconnecting.bind($scope.session, true))
          $scope.session.on('sessionReconnected', reconnecting.bind($scope.session, false))
        })

        $scope.publishing = true
        return result_token
      })   
  }

  $scope.$on('$destroy', function () {
    if ($scope.session && $scope.connected) {
      $scope.session.disconnect()
      $scope.connected = false
    }
    $scope.session = null
  })

  // Ends and Deletes the scope's session from user calls
  $scope.endVideo = function () {
    console.log('in ending Video')
    if (!$scope.leaving) {
      $scope.leaving = true
      $scope.session.disconnect()

      $scope.session.on('sessionDisconnected', function () {
        console.log('Session disconnected.')

      sessionFactory.deleteSession($scope.sessionName)

        //   .then(function (result_delete) {
        //     console.log(result_delete.data)
        //     return result_delete
        // })

      })
    }
  }
}])
