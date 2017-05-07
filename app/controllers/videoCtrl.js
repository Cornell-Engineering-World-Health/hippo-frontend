/*
* Controller for all video interface functionalities from initialization to ending call.
*/
app.controller('VideoCtrl',['$scope', '$stateParams', '$http', '$window','$log',
  'OTSession', 'VideoService', 'SocketService', 'UserService', 'User',
  function ($scope, $stateParams, $http, $window, $log, OTSession, VideoService,
   SocketService, UserService, User) {

  var baseURL = UserService.baseUrlAPI

  $scope.streams = OTSession.streams
  $scope.connections = OTSession.connections
  $scope.publishers = OTSession.publishers
  $scope.publishing = false
  $scope.archiveId = null
  $scope.archiving = false
  $scope.connected = false
  $scope.reconnecting = false
  $scope.leaving = false
  $scope.deleted = false
  $scope.connectionCount = 0
  $scope.session_name = $stateParams.session_name // session_name passed from URL

  SocketService.emit("enteringSession",{sessioName: $scope.session_name})

  // Get project API key from config to initiate OpenTok session.
  $http.get('./config.json').success(function(data) {
    $scope.apiKey = data.apiKey;
  });

  // Get userId from /self endpoint to send in all CDRs.
  $scope.getSelf = function() {
    User.getSelf()
        .then(function (response) {
          $scope.userId = response.data.userId
        })
        .catch(function (error) {
            console.log(error)
            return error
        })
  }

  // Toggle video publishing. Called on click of toggle-video button.
  $scope.togglePublish = function() {
    $scope.publishing = !$scope.publishing;
  }

  // Gets newly generated, unique token for this session.
  $scope.getToken = function () {
    return $http.get(baseURL+ '/videos/' + $scope.session_name)
      .then(function (response) {
        return response.data
      })
      .catch(function(error) {
        console.error('Failed to get token. Error: ' + error.data);
      })
  }

  // Initialize OTSession object upon success of getToken().
  $scope.getToken()
    .then(function (result_token) {

      // Stop clients from connecting to session more than once.
      if ($scope.session) {
        console.log('You are already connected.')
        $scope.session.disconnect()
        return;
      }

      // Initialize OTSession.
      OTSession.init($scope.apiKey, result_token.sessionId, result_token.tokenId,
        function(err, session) {
        if(err) {
          $scope.$broadcast('otError', {message: 'Initialize session error.'})
          return
        }

        // Bind session object to scope.
        $scope.session = session

        // Called when listener detects a connection/disconnect.
        // [connected] is true on connection and false on disconnect.
        var connectDisconnect = function (connected) {
          $scope.$apply(function () {
            $scope.connected = connected
            $scope.reconnecting = false

            if (!connected) {
              $scope.publishing = false
            }
            else {
              // Emit sessionConnected CDR.
              var sessionConnectedJSON = {sessionName : $scope.session_name}
              SocketService.emit("sessionConnected", sessionConnectedJSON)
            }
          })
        }

        // Called when client is attempting to recconect.
        // [isReconnecting] is true when client is reconnecting.
        var reconnecting = function (isReconnecting) {
          $scope.$apply(function () {
            // Bind new reconnecting boolean.
            $scope.reconnecting = isReconnecting
          })
        }

        // Maintain connection.
        if (($scope.session.is && $scope.session.is('connected')) || $scope.session.connected) {
          connectDisconnect(true)
        }

        // Listeners for events that don't emit CDR logs.
        $scope.session.on('sessionConnected', connectDisconnect.bind($scope.session, true))
        $scope.session.on('sessionReconnecting', reconnecting.bind($scope.session, true))
        $scope.session.on('sessionReconnected', reconnecting.bind($scope.session, false))

        // Listeners for events that emit CDR logs.
        $scope.session.on({
          // A Client emits one sessionDisconnected event to itself on disconnect.
          sessionDisconnected: function (event) {
            $scope.$apply(function () {
              $scope.connected = false
              $scope.reconnecting = false
              $scope.publishing = false
            })

            var d = new Date()
            var time = d.getTime()

            var sessionDisconnectedJSON = {
              eventType : "sessionDisconnected",
              sessionName : $scope.session_name,
              timestamp : time,
              userId : $scope.userId,
              reason: event.reason
            }
            console.log(sessionDisconnectedJSON)
            SocketService.emit("sessionDisconnected", sessionDisconnectedJSON)
          },
          // A Client emits connectionCreated event to itself and every other
          // client who connects to the call for the duration of this Client's
          // connection.
          connectionCreated: function (event) {
            $scope.connectionCount++;

            var d = new Date()
            var time = d.getTime()

            var connectionCreatedJSON = {
              eventType : 'connectionCreated',
              sessionName : $scope.session_name,
              timestamp : time,
              clientId : $scope.userId,
              userConnectionId : event.connection.connectionId
            }
            SocketService.emit("connectionCreated", connectionCreatedJSON)
          },
          // A Client emits connectionDestroyed event upon disconnecting from
          // the session to everyone connected to the session at the
          // time of the event.
          connectionDestroyed: function (event) {
            $scope.connectionCount--;

            var d = new Date()
            var time = d.getTime()

            var connectionDestroyedJSON = {
              eventType : 'connectionDestroyed',
              sessionName : $scope.session_name,
              timestamp : time,
              clientId : $scope.userId,
              userConnectionId : event.connection.connectionId,
              reason: event.reason
            }
            SocketService.emit("connectionDestroyed", connectionDestroyedJSON)
          },
          // A Client emits streamCreated event to every other client besides
          // itself who connects to the call for the duration of this Client's
          // connection.
          streamCreated: function(event) {
            var d = new Date()
            var time = d.getTime()

            var streamCreatedJSON = {
              eventType : "streamCreated",
              sessionName : $scope.session_name,
              timestamp : new Date(event.stream.creationTime),
              clientId : $scope.userId,
              userConnectionId : event.stream.connection.connectionId,
            }
            SocketService.emit('streamCreated', streamCreatedJSON)

            var frameRateJSON = {
              eventType : "frameRate",
              sessionName : $scope.session_name,
              timestamp : time,
              clientId : $scope.userId,
              userConnectionId : event.stream.connection.connectionId,
              frameRate : event.stream.frameRate
            }
            SocketService.emit('frameRate', frameRateJSON)

            var audioJSON = {
              eventType : "hasAudio",
              sessionName : $scope.session_name,
              timestamp : time,
              clientId : $scope.userId,
              userConnectionId : event.stream.connection.connectionId,
              hasAudio : event.stream.hasAudio
            }
            SocketService.emit('hasAudio', audioJSON)

            var videoJSON = {
              eventType : "hasVideo",
              sessionName : $scope.session_name,
              timestamp : time,
              clientId : $scope.userId,
              userConnectionId : event.stream.connection.connectionId,
              hasVideo : event.stream.hasVideo
            }
            SocketService.emit('hasVideo', videoJSON)

            var videoDimensionsJSON = {
              eventType : "videoDimensions",
              sessionName : $scope.session_name,
              timestamp : time,
              clientId : $scope.userId,
              userConnectionId : event.stream.connection.connectionId,
              width : event.stream.videoDimensions.width,
              height : event.stream.videoDimensions.height
            }
            SocketService.emit('videoDimensions', videoDimensionsJSON)

            var videoTypeJSON = {
              eventType : "videoType",
              sessionName : $scope.session_name,
              timestamp : time,
              clientId : $scope.userId,
              userConnectionId : event.stream.connection.connectionId,
              videoType : event.stream.videoType
            }
            SocketService.emit('videoType', videoTypeJSON)
          },
          // A Client emits a streamDestroyed event to everyone connected to
          // the session at the time of the event besides itself upon
          // unpublishing from a stream.
          streamDestroyed: function(event) {

            var d = new Date()
            var time = d.getTime()

            var streamDestroyedJSON = {
              eventType : "streamDestroyed",
              sessionName : $scope.session_name,
              timestamp : time,
              clientId : $scope.userId,
              userConnectionId : event.stream.connection.connectionId,
              reason : event.reason
            }
            SocketService.emit('streamDestroyed', streamDestroyedJSON)
          },
          // A Client emits a streamProperty changed to everyone connected to
          // the session at the time of the event besides itself upon
          // changing a stream property.
          streamPropertyChanged: function(event) {

            var d = new Date()
            var time = d.getTime()

            if (event.changedProperty == "hasAudio") {
              var audioJSON = {
                eventType : "hasAudio",
                sessionName : $scope.session_name,
                timestamp : time,
                clientId : $scope.userId,
                userConnectionId : event.stream.connection.connectionId,
                hasAudio : event.newValue
              }
              SocketService.emit('hasAudio', audioJSON)
            }
            else if (event.changedProperty == "hasVideo") {
              var videoJSON = {
                eventType : "hasAudio",
                sessionName : $scope.session_name,
                timestamp : time,
                clientId : $scope.userId,
                userConnectionId : event.stream.connection.connectionId,
                hasVideo : event.newValue
              }
              SocketService.emit('hasVideo', videoJSON)
            }
            else {
              var videoDimensionsJSON = {
                eventType : "videoDimensions",
                sessionName : $scope.session_name,
                timestamp : time,
                clientId : $scope.userId,
                userConnectionId : event.stream.connection.connectionId,
                width : event.newValue.videoDimensions.width,
                height : event.newValue.videoDimensions.height
              }
              SocketService.emit('videoDimensions', videoDimensionsJSON)
            }
          }
        })
      })
      //$scope.publishing = true
      return result_token
    })

  // Listens for call disconnects.
  $scope.$on('$destroy', function () {
    if ($scope.session && $scope.connected) {
      $scope.session.disconnect()
      $scope.connected = false
    }
    $scope.session = null
  })

  // Called on click of end call button.
  $scope.endVideo = function () {
    if (!$scope.leaving) {
      $scope.leaving = true
      $scope.session.disconnect()
    }
    $scope.session.on('sessionDisconnected', function() {
      $scope.$apply(function() {
        $window.location.href = UserService.baseInterfaceUrl + '/#/user'
      })
    })
  }

  $scope.getSelf()
}])
