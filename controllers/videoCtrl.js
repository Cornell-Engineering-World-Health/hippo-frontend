app.controller('VideoCtrl', ['$scope', '$http', '$window', '$log', 'OTSession', 'VideoService', 'SocketService',
  function ($scope, $http, $window, $log, OTSession, VideoService, SocketService) {

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
    //console.log(data)
    $scope.apiKey = data.apiKey;
  });

  $http.get('https://ewh-hippo.herokuapp.com/api/self').success(function (data) {
    $scope.userId = data.userId
    console.log($scope.userId)
  })

  $scope.getVideoByName = function (session_name) {
    if ($scope.session) {
      console.log('You are already connected.')
      return
    }

    VideoService.getNewToken(session_name)
      .then(function (result_token) {
        console.log(result_token)

        OTSession.init($scope.apiKey, result_token.sessionId, result_token.tokenId, function(err, session) {
          if(err) {
            console.log('sessionId: ' + result_token.sessionId + ' tokenId: ' + result_token.tokenId)
            $scope.$broadcast('otError', {message: 'initialize session error'})
            return
          }

          $scope.session = session
          $scope.sessionName = session_name

          

          // var connect = function (connected) {
          //   $scope.$apply(function () {
          //     $scope.connected = connected
          //     $scope.reconnecting = false
          //     console.log('sessionConnected.')
          //   })
          // }

          // var disconnect = function (connected, event) {
          //   $scope.$apply(function () {
          //     $scope.connected = connected
          //     $scope.reconnecting = false
              
          //     $scope.publishing = false
          //     console.log('sessionDisconnected.')
          //     console.log(event)
              // var d = new Date()
              // var time = d.getTime()
              // var sessionDisconnectedJSON = {}
              // sessionDisconnectedJSON['eventType'] = "sessionDisconnected"
              // sessionDisconnectedJSON['sessionName'] = $scope.sessionName
              // sessionDisconnectedJSON['timestamp'] = time
              // sessionDisconnectedJSON['userId'] = $scope.userId
              // sessionDisconnectedJSON['reason'] = event.reason
              // SocketService.emit("sessionDisconnected", sessionDisconnectedJSON)
              
          //   })
          // }
          var connectDisconnect = function (connected) {
            $scope.$apply(function () {
              $scope.connected = connected
              $scope.reconnecting = false
              if (!connected) {
                $scope.publishing = false
                console.log('sessionDisconnected.')

                var d = new Date()
                var time = d.getTime()
                var sessionDisconnectedJSON = {}
                sessionDisconnectedJSON['eventType'] = "sessionDisconnected"
                sessionDisconnectedJSON['sessionName'] = $scope.sessionName
                sessionDisconnectedJSON['timestamp'] = time
                sessionDisconnectedJSON['userId'] = $scope.userId
                sessionDisconnectedJSON['reason'] = "clientDisconnected" 
                SocketService.emit("sessionDisconnected", sessionDisconnectedJSON)
              }
              else 
                console.log('sessionConnected.')
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
          $scope.session.on('sessionDisconnected', connectDisconnect.bind($scope.session, false))

          //   function (event) {
          //   return disconnect.bind($scope.session, false, event)
          // })
            

          $scope.session.on('sessionReconnecting', reconnecting.bind($scope.session, true))
          $scope.session.on('sessionReconnected', reconnecting.bind($scope.session, false))

          $scope.session.on({
            connectionCreated: function (event) {
              $scope.connectionCount++;
              console.log('connectionCreated Client ' + event.connection.connectionId + ' connected. ' 
                + $scope.connectionCount + ' connections total. userId = ' + $scope.userId);

              var d = new Date()
              var time = d.getTime()

              var connectionCreatedJSON = {
                eventType : 'connectionCreated',
                sessionName : $scope.sessionName,
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
                sessionName : $scope.sessionName,
                timestamp : time,
                clientId : $scope.userId,
                userConnectionId : event.connection.connectionId,
                reason: event.reason
              }
              //console.log(JSON.stringify(connectionDestroyedJSON))
              SocketService.emit("connectionDestroyed", connectionDestroyedJSON)
            },
            streamCreated: function(event) {
              // TODO: LOG TO BACKEND
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

              var streamCreatedJSON = {}
              streamCreatedJSON['eventType'] = "streamCreated"
              streamCreatedJSON['sessionName'] = $scope.sessionName
              streamCreatedJSON['timestamp'] = new Date(event.stream.creationTime)
              streamCreatedJSON['clientId'] = $scope.userId
              streamCreatedJSON['userConnectionId'] = event.stream.connection.connectionId
              SocketService.emit('streamCreated', streamCreatedJSON)

              var frameRateJSON = {};
              frameRateJSON['eventType'] = "frameRate"
              frameRateJSON['sessionName'] = $scope.sessionName
              frameRateJSON['timestamp'] = time
              frameRateJSON['clientId'] = $scope.userId
              frameRateJSON['userConnectionId'] = event.stream.connection.connectionId
              frameRateJSON['frameRate'] = event.stream.frameRate
              SocketService.emit('frameRate', frameRateJSON)

              var audioJSON = {}
              audioJSON['eventType'] = "hasAudio"
              audioJSON['sessionName'] = $scope.sessionName
              audioJSON['timestamp'] = time
              audioJSON['clientId'] = $scope.userId
              audioJSON['userConnectionId'] = event.stream.connection.connectionId
              audioJSON['hasAudio'] = event.stream.hasAudio
              SocketService.emit('hasAudio', audioJSON)

              var videoJSON = {}
              videoJSON['eventType'] = "hasVideo"
              videoJSON['sessionName'] = $scope.sessionName
              videoJSON['timestamp'] = time
              videoJSON['clientId'] = $scope.userId
              videoJSON['userConnectionId'] = event.stream.connection.connectionId
              videoJSON['hasVideo'] = event.stream.hasVideo
              SocketService.emit('hasVideo', videoJSON)

              var videoDimensionsJSON = {}
              videoDimensionsJSON['eventType'] = "videoDimensions"
              videoDimensionsJSON['sessionName'] = $scope.sessionName
              videoDimensionsJSON['timestamp'] = time
              videoDimensionsJSON['clientId'] = $scope.userId
              videoDimensionsJSON['userConnectionId'] = event.stream.connection.connectionId
              videoDimensionsJSON['width'] = event.stream.videoDimensions.width
              videoDimensionsJSON['height'] = event.stream.videoDimensions.height
              SocketService.emit('videoDimensions', videoDimensionsJSON)

              var videoTypeJSON = {}
              videoTypeJSON['eventType'] = "videoType"
              videoTypeJSON['sessionName'] = $scope.sessionName
              videoTypeJSON['timestamp'] = time
              videoTypeJSON['clientId'] = $scope.userId
              videoTypeJSON['userConnectionId'] = event.stream.connection.connectionId
              videoTypeJSON['videoType'] = event.stream.videoType
              SocketService.emit('videoType', videoTypeJSON)
              
            },
            streamDestroyed: function(event) {
              // TODO: LOG TO BACKEND
              console.log('streamDestroyed: Connection ' + event.stream.connection.connectionId + 
                ' destroyed for reason ' + event.reason + '.')
              
              var d = new Date()
              var time = d.getTime()

              var streamDestroyedJSON = {}
              streamDestroyedJSON['eventType'] = "streamDestroyed"
              streamDestroyedJSON['sessionName'] = $scope.sessionName
              streamDestroyedJSON['timestamp'] = time
              streamDestroyedJSON['clientId'] = $scope.userId
              streamDestroyedJSON['userConnectionId'] = event.stream.connection.connectionId
              streamDestroyedJSON['reason'] = event.reason
              SocketService.emit('streamDestroyed', streamDestroyedJSON)
            },
            streamPropertyChanged: function(event) {
              //changedProperty: hasAudio, hasVideo, videoDimensions
              // TODO: LOG TO BACKEND
              console.log('streamPropertyChanged: Connection ' + event.target.stream.connection.connectionId + 
                ' changed.')
              console.log('changedProperty: ' +event.changedProperty+ ' newValue: '+event.newValue+
                ' oldValue: ' +event.oldValue+ ' connectionId: ' +event.target.stream.connection.connectionId)
              
              var d = new Date()
              var time = d.getTime()
              
              if (event.changedProperty == "hasAudio") {
                var audioJSON = {}
                audioJSON['eventType'] = "hasAudio"
                audioJSON['sessionName'] = $scope.sessionName
                audioJSON['timestamp'] = time
                audioJSON['clientId'] = $scope.userId
                audioJSON['userConnectionId'] = event.stream.connection.connectionId
                audioJSON['hasAudio'] = event.newValue
                SocketService.emit('hasAudio', audioJSON)
              }
              else if (event.changedProperty == "hasVideo") {
                var videoJSON = {}
                videoJSON['eventType'] = "hasVideo"
                videoJSON['sessionName'] = $scope.sessionName
                videoJSON['timestamp'] = time
                videoJSON['clientId'] = $scope.userId
                videoJSON['userConnectionId'] = event.stream.connection.connectionId
                videoJSON['hasVideo'] = event.newValue
                SocketService.emit('hasVideo', videoJSON)
              }
              else {
                var videoDimensionsJSON = {}
                videoDimensionsJSON['eventType'] = "videoDimensions"
                videoDimensionsJSON['sessionName'] = $scope.sessionName
                videoDimensionsJSON['timestamp'] = time
                videoDimensionsJSON['clientId'] = $scope.userId
                videoDimensionsJSON['userConnectionId'] = event.stream.connection.connectionId
                videoDimensionsJSON['width'] = event.newValue.videoDimensions.width
                videoDimensionsJSON['height'] = event.stream.videoDimensions.height
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
  })

  $scope.endVideo = function () {
    if (!$scope.leaving) {
      $scope.leaving = true
      $scope.session.disconnect() //Disconnects and unpublishes
      $scope.connected = false
      $scope.session = null
    }
  }
}])