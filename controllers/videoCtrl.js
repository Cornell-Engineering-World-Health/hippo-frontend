app.controller('VideoCtrl', ['$scope', '$http', '$window', '$log', 'OTSession', function($scope, $http, $window, $log, OTSession) {
  console.log(OTSession)
  $scope.streams = OTSession.streams;
  $scope.connections = OTSession.connections;
  $scope.publishing = false;
  $scope.archiveId = null;
  $scope.archiving = false;
  $scope.connected = false;
  $scope.reconnecting = false;
  $scope.leaving = false;
  $scope.getVideo = function() {
    if ($scope.session) {
      $scope.session.disconnect();
    }
    OTSession.init('45786882', '1_MX40NTc4Njg4Mn5-MTQ4ODY1ODQ4MDEwMn5SZW5Rd1RlTlpKNGkzcWtBaEFpYjNMNmd-fg', "T1==cGFydG5lcl9pZD00NTc4Njg4MiZzaWc9ODRhOTMyZmM2YjI4MWJkOTBiODAwMDliOGNlOTg5M2NiYTBkZWI3NzpzZXNzaW9uX2lkPTFfTVg0ME5UYzROamc0TW41LU1UUTRPRFkxT0RRNE1ERXdNbjVTWlc1UmQxUmxUbHBLTkdremNXdEJhRUZwWWpOTU5tZC1mZyZjcmVhdGVfdGltZT0xNDg4NjU4NDk0Jm5vbmNlPTAuNTU5OTQzMzk5Njg5MzcxMiZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNDkxMjQ2ODkz", function(err, session) {
      if (err) {
        $scope.$broadcast('otError', {message: 'initialize session error'});
        return;
      }
      $scope.session = session;
      var connectDisconnect = function(connected) {
            $scope.$apply(function() {
              $scope.connected = connected;
              $scope.reconnecting = false;
              if (!connected) {
                $scope.publishing = false;
              }
            });
      }
      var reconnecting = function(isReconnecting) {
        $scope.$apply(function() {
          $scope.reconnecting = isReconnecting;
        });
      };
      if ((session.is && session.is('connected')) || session.connected) {
        connectDisconnect(true);
      }
      $scope.session.on('sessionConnected', connectDisconnect.bind($scope.session, true));
      $scope.session.on('sessionDisconnected', connectDisconnect.bind($scope.session, false));
      $scope.session.on('archiveStarted archiveStopped', function(event) {
        // event.id is the archiveId
        $scope.$apply(function() {
          $scope.archiveId = event.id;
          $scope.archiving = (event.type === 'archiveStarted');
        });
      });
      $scope.session.on('sessionReconnecting', reconnecting.bind($scope.session, true));
      $scope.session.on('sessionReconnected', reconnecting.bind($scope.session, false));
    });
    $scope.publishing = true;
  }
  $scope.$on('$destroy', function() {
    if ($scope.session && $scope.connected) {
      $scope.session.disconnect();
      $scope.connected = false;
    }
    $scope.session = null;
  });
  $scope.endVideo = function() {
    console.log("in ending Video")
    if (!$scope.leaving) {
      $scope.leaving = true;
      $scope.session.disconnect();
      $scope.session.on('sessionDisconnected', function() {
        console.log('Session disconnected.')
      });
    }
  };
}])