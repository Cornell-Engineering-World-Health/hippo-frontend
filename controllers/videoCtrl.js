app.controller('VideoCtrl', ['$scope', '$http', '$window', '$log', 'OTSession', 'VideoService',
  function ($scope, $http, $window, $log, OTSession, VideoService) {

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
    console.log(data)
    $scope.apiKey = data.apiKey;
  });

  $scope.getVideoByName = function (session_name) {
    if ($scope.session) {
      console.log('You are already connected.')
      //$scope.session.disconnect()
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

          if (($scope.session.is && $scope.session.is('connected')) || $scope.session.connected) {
            connectDisconnect(true)
          }

          $scope.session.on('sessionConnected', connectDisconnect.bind($scope.session, true))
          $scope.session.on('sessionDisconnected', connectDisconnect.bind($scope.session, false))

          $scope.session.on('sessionReconnecting', reconnecting.bind($scope.session, true))
          $scope.session.on('sessionReconnected', reconnecting.bind($scope.session, false))

          $scope.session.on({
            connectionCreated: function (event) {
              $scope.connectionCount++;
              console.log('Client ' + event.connection.connectionId + ' connected. ' + $scope.connectionCount + ' connections total.');

            },
            connectionDestroyed: function (event) {
              $scope.connectionCount--;
              console.log('Client ' + event.connection.connectionId + ' disconnected for reason: ' + event.reason + '. ' + $scope.connectionCount + ' connections total.');
            }
          })

          // Listen for publisher connection errors
          var getPublisher = function() {
            return $scope.publishers.filter(function (el) {
              //Assumes DOM element called publisher...
              var publisherElem = document.getElementById('publisher')
              return el.id === publisherElem.id //is this unique?
            })
          }

          var publisher = getPublisher()
          publisher.on({
            streamCreated: function(event) {

            },
            streamDestroyed: function(event) {
              if (event.reason === 'networkDisconnected') {
                console.log('Stream ' + event.stream.name + ' destroyed by network disconnect.')
                
                var record = {}
                record["reason"] = event.reason
                record["creationtime"] = event.stream.creationTime
                record["frameRate"] = event.stream.frameRate
                record["hasAudio"] = event.stream.hasAudio
                record["videoDimensions"] = event.stream.videoDimensions
                record["videoType"] = event.stream.videoType

                // Send to backend? Or reconnect?
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
    console.log('in ending Video')
    if (!$scope.leaving) {
      $scope.leaving = true
      $scope.session.disconnect() //Disconnects and unpublishes
      $scope.connected = false

      // When YOU disconnect, the Session object dispatches a sessionDisconnected event
      $scope.session.on('sessionDisconnected', function (event) {
        console.log('Session disconnected.')
        var reason = event.reason
        if ($scope.connectionCount == 1) // last one leaving session
          VideoService.deleteSession($scope.sessionName)
      })

      $scope.session = null
    }
  }


}])
