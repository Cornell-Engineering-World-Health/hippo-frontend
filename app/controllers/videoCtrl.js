app.controller('VideoCtrl', ['$scope', '$http', '$window', '$log', 'OTSession', 'VideoService', 'UserVideoService',
  function ($scope, $http, $window, $log, OTSession, VideoService, UserVideoService) {
// app.controller('VideoCtrl', ['$scope', '$http', '$window', '$log', 'OTSession', 'VideoService',
//   function ($scope, $http, $window, $log, OTSession, VideoService) {

  $scope.streams = OTSession.streams
  $scope.connections = OTSession.connections
  $scope.publishing = false
  $scope.archiveId = null
  $scope.archiving = false
  $scope.connected = false
  $scope.reconnecting = false
  $scope.leaving = false
  $scope.deleted = false

  // Wrap in VideoService?
  $http.get('./config.json').success(function(data) {
    $scope.apiKey = data.apiKey;
  });

  $scope.getSessionName = function() {
    $scope.session_name = UserVideoService.get()
    console.log($scope.session_name)
  }

  $scope.togglePublish = function() {
    $scope.publishing = !$scope.publishing;
  };

  UserVideoService.getToken()
    .then(function (result_token) {
      if ($scope.session) {
        $scope.session.disconnect()
        return;
      }

      OTSession.init($scope.apiKey, result_token.sessionId, result_token.tokenId, function(err, session) {
        if(err) {
          console.log('sessionId: ' + result_token.sessionId + ' tokenId: ' + result_token.tokenId)
          $scope.$broadcast('otError', {message: 'initialize session error'})
          return
        }

        $scope.session = session
        console.log('videoCtrl:'+$scope.session)
        $scope.sessionName = $scope.session_name

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

      //$scope.publishing = true
      console.log($scope.publishing)
    })

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
    }
  }

  $scope.getSessionName()
}])
