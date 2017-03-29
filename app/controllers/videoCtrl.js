app.controller('VideoCtrl', ['$scope', '$http', '$window', '$log', 'OTSession', 'VideoService', 'UserVideoService', 'SocketService',
  function ($scope, $http, $window, $log, OTSession, VideoService, UserVideoService, SocketService) {

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

  // Wrap in VideoService?
  $http.get('./config.json').success(function(data) {
    $scope.apiKey = data.apiKey;
  });

  $http.get('https://ewh-hippo.herokuapp.com/api/self').success(function (data) {
    $scope.userId = data.userId
    console.log($scope.userId)
  })

  $scope.getSessionName = function() {
    $scope.session_name = UserVideoService.get()
  }

  $scope.getVideoByName = function (session_name) {
    console.log("getVideoByName: " +$scope.session)
    if ($scope.session) {
      console.log('You are already connected.')
      return
    }

    VideoService.getNewToken(session_name)
      .then(function (result_token) {

        OTSession.init($scope.apiKey, result_token.sessionId, result_token.tokenId, function(err, session) {
          if(err) {
            console.log('sessionId: ' + result_token.sessionId + ' tokenId: ' + result_token.tokenId)
            $scope.$broadcast('otError', {message: 'initialize session error'})
            return
          }

          $scope.session = session
          $scope.session_name = session_name
          
          var connectDisconnect = function (connected) {
            $scope.$apply(function () {
              console.log("connectDisconnect: connected = "+connected)
              $scope.connected = connected
              $scope.reconnecting = false
              if (!connected) {
                $scope.publishing = false
                console.log('connectDisconnect: sessionDisconnected.')
              }
              else {
                console.log('connectDisconnect: sessionConnected.')
                var sessionConnectedJSON = {session_name : $scope.session_name}
                SocketService.emit("sessionConnected", sessionConnectedJSON)
              }
                

            })
          }

          var reconnecting = function (isReconnecting) {
            if (isReconnecting)
              console.log('Client ' + event.connection.connectionId + ' is reconnecting...')
            else
              console.log('Client ' + event.connection.connectionId + ' has reconnected.')
            $scope.$apply(function () {
              $scope.reconnecting = isReconnecting
            })
          }

          if (($scope.session.is && $scope.session.is('connected')) || $scope.session.connected) {
            connectDisconnect(true)
          }

          $scope.session.on('sessionConnected', connectDisconnect.bind($scope.session, true))
          //$scope.session.on('sessionDisconnected', connectDisconnect.bind($scope.session, false))            

          $scope.session.on('sessionReconnecting', reconnecting.bind($scope.session, true))
          $scope.session.on('sessionReconnected', reconnecting.bind($scope.session, false))

          $scope.session.on({
            sessionDisconnected: function (event) {
              console.log("sessionDisconnected for reason "+ event.reason)
              $scope.$apply(function () {
                $scope.connected = false
                $scope.reconnecting = false
                $scope.publishing = false
              })

              console.log("connected = "+$scope.connected+
              " reconnecting = "+$scope.reconnecting+
              " publishing = "+$scope.publishing)

              var d = new Date()
              var time = d.getTime()
              var sessionDisconnectedJSON = {
                eventType : "sessionDisconnected",
                sessionName : $scope.session_name,
                timestamp : time,
                userId : $scope.userId,
                reason: event.reason
              }
              SocketService.emit("sessionDisconnected", sessionDisconnectedJSON)
            },
            connectionCreated: function (event) {
              $scope.connectionCount++;
              console.log('connectionCreated Client ' + event.connection.connectionId + ' connected. ' 
                + $scope.connectionCount + ' connections total. userId = ' + $scope.userId);

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
            connectionDestroyed: function (event) {
              $scope.connectionCount--;
              console.log('connectionDestroyed Client ' + event.connection.connectionId + ' disconnected for reason: '
                 + event.reason + '. ' + $scope.connectionCount + ' connections total. userId = ' + $scope.userId);

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
              //console.log(JSON.stringify(connectionDestroyedJSON))
              SocketService.emit("connectionDestroyed", connectionDestroyedJSON)
            },
            streamCreated: function(event) {
              console.log('streamCreated: Connection ' + event.stream.connection.connectionId + 
                ' created.')
              console.log(
                'frameRate: ' + event.stream.frameRate +
                ' hasAudio: ' + event.stream.hasAudio + 
                ' hasVideo: ' + event.stream.hasVideo + 
                ' videoDimensions: width = ' + event.stream.videoDimensions.width + 
                                 ' height = ' + event.stream.videoDimensions.height +
                ' videoType: ' + event.stream.videoType)
             
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
            streamDestroyed: function(event) {
              console.log('streamDestroyed: Connection ' + event.stream.connection.connectionId + 
                ' destroyed for reason ' + event.reason + '.')
              
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
            streamPropertyChanged: function(event) {
              console.log('streamPropertyChanged: Connection ' + event.target.stream.connection.connectionId + 
                ' changedProperty: ' +event.changedProperty+ ' newValue: '+event.newValue+
                ' oldValue: ' +event.oldValue+ ' connectionId: ' +event.target.stream.connection.connectionId)
              
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

        $scope.publishing = true
        return result_token
      })
  }

  // For when all streams have disconnected and html goes away?
  $scope.$on('$destroy', function () {
    if ($scope.session && $scope.connected) {
      $scope.session.disconnect()
      $scope.connected = false
    }
    $scope.session = null
    console.log("DESTROY: connected = " +$scope.connected+" session = "+$scope.session)
  })

  $scope.endVideo = function () {
    if (!$scope.leaving) {
      $scope.leaving = true
      $scope.session.disconnect() //Disconnects and unpublishes

      // $scope.session.on('sessionDisconnected', function() {
      //   $scope.$apply(function() {
      //     $window.location.href = 'http://localhost:8080/#/user'
      //   })
      // })

    }
    console.log("endVideo: leaving = "+$scope.leaving+" connected = "+$scope.connected+" session = "+$scope.session)
  }

  $scope.getSessionName()
}])