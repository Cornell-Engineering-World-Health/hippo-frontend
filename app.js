// angular.module('demo', ['opentok'])
//   .controller('MyCtrl', ['$scope', 'OTSession', 'apiKey', 'sessionId', 'token', function($scope, OTSession, apiKey, sessionId, token) {
//       console.log(OTSession)
//       OTSession.init(apiKey, sessionId, token);
//       $scope.streams = OTSession.streams;
//   }]).value({
//       apiKey: 'YOUR_APIKEY',
//       sessionId: 'YOUR_SESSION_ID',
//       token: 'YOUR_TOKEN'
//   });


var app = angular.module( "myApp", ['opentok', 'ui.router', 'satellizer'] );

app.config( function ( $stateProvider, $urlRouterProvider, $authProvider ) {
  var skipIfLoggedIn = ['$q', '$auth', function($q, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.reject();
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    }]

    var loginRequired = ['$q', '$location', '$auth', function($q, $location, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.resolve();
      } else {
        $location.path('/login');
      }
      return deferred.promise;
    }]

  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'partials/login.html',
      controller: 'LoginCtrl',
      resolve: {
        skipIfLoggedIn: skipIfLoggedIn
      }
    })
    .state('home', {
      url: '/',
      templateUrl: 'index.html',
      controller: 'LoginCtrl',
      resolve: {
        skipIfLoggedIn: skipIfLoggedIn
      }
    })
    .state('logout', {
      url: '/logout',
      template: null,
      controller: 'LogoutCtrl'
    })
    .state('video', {
      url: '/video',
      templateUrl: 'partials/video.html',
      controller: 'VideoController'
    })
    $urlRouterProvider.otherwise('/');
    // .when( '/video', { templateUrl: 'index.html' } )
    // .when( '/', { templateUrl: 'index.html' } )
    // .when( '/home', { templateUrl: 'index.html' } )
    // .when( '/videocall', { templateUrl: 'video.html' } )
    // .otherwise( { redirectTo: '/video' } );

    $authProvider.google({
      clientId: '711259324524-36d8oudk6g40g1ioel59hhegcjd3n5t1.apps.googleusercontent.com'
    });
});
app.factory('sessionFactory', ['$http', function($http) {
  var service = {
    createSession: function(sessionData) {
      // TODO: why are we exposing this in post url; no need
      return $http.post('/videos/' + sessionData.caller_id + '/users/' + sessionData.callee_id, sessionData)
        .then(function(response) {
          return alert("success");
        })
        .catch(function(error) {
          console.error('Failed post. Error: ' + error.data);
        })
    },
    getNewToken: function(session_name) {
      return $http.get('/videos/' + session_name)
        .then(function (response) {
          return response.data
        })
        .catch(function(error) {
          console.error('Failed to get token. Error: ' + error.data);
        })
    },
    // TODO: why are we not using session_name.
    deleteSession: function(session_name) {
      return $http.delete('/videos/' + session_name)
        .then( function (response){
          return response.data
        })
        .catch(function(error) {
          console.error('Failed to delete session. Error: ' + error.data);
        })
    }
  };
  return service;
}])

app.controller('UserController', ['$scope', '$log', 'sessionFactory', function($scope, $log, sessionFactory) {
  $scope.users =
  [
    {
      "userId": 0,
      "firstName": "Ann",
      "lastName": "Brown",
      "email": "ab@gmail.com",
    }
  ]
  $scope.userSessions =
  [
    {
      datetime: "2017-03-05T14:24:17.725Z",
      sessionId: "1_MX40NTc4Njg4Mn5-MTQ4ODcyMzg1NzY5OH5WR0c4UEMwTTJ2SlQ5akNDbENWMUhXS1h-UH4",
      name: "okapi453",
      _id: "58bc1f91eaad2d00119618f8",
      participants: [],
      tokenId: "T1==cGFydG5lcl9pZD00NTc4Njg4MiZzaWc9ZGYxNmJmZGI4ZDBlZmIzZDNkY2IwNjIyZDljOTRmNzIzMjNmMzVhNDpzZXNzaW9uX2lkPTFfTVg0ME5UYzROamc0TW41LU1UUTRPRGN5TXpnMU56WTVPSDVXUjBjNFVFTXdUVEoyU2xRNWFrTkRiRU5XTVVoWFMxaC1VSDQmY3JlYXRlX3RpbWU9MTQ4ODcyMzg1OCZub25jZT0wLjM3OTk5Njg0NDQzMTYwNDQmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTQ4ODgxMDI1OA=="
    },
    {
      datetime: "2017-03-05T14:29:44.805Z",
      sessionId: "1_MX40NTc4Njg4Mn5-MTQ4ODcyMzg4NDc5Mn5XZ2UzUjd4Uk9oSUxaeThQdVNLVUhWblN-UH4",
      name: "dinosaur392",
      _id: "58bc1faceaad2d00119618f9",
      participants: [],
      tokenId: "T1==cGFydG5lcl9pZD00NTc4Njg4MiZzaWc9NGE0MDczY2E4MWIzY2EyODk4ZDIyYWM3ZTZlOTBjOGE3ZDc1NzQ3ZTpzZXNzaW9uX2lkPTFfTVg0ME5UYzROamc0TW41LU1UUTRPRGN5TXpnNE5EYzVNbjVYWjJVelVqZDRVazlvU1V4YWVUaFFkVk5MVlVoV2JsTi1VSDQmY3JlYXRlX3RpbWU9MTQ4ODcyMzg4NSZub25jZT0wLjc3NjQwNDA5OTkwNDE0OSZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNDg4ODEwMjg1"
    },
    {
      datetime: "2017-02-02T10:24:18.805Z",
      sessionId: "1_MX40NTc4Njg4Mn5-MTQ4ODcyMzg4NDc5Mn5XZ2UzUjd4Uk9oSUxaeThQdVNLVUhWblN-UH4",
      name: "turtle406",
      _id: "58bc1faceaad2d00119618f9",
      participants: [],
      tokenId: "T1==cGFydG5lcl9pZD00NTc4Njg4MiZzaWc9NGE0MDczY2E4MWIzY2EyODk4ZDIyYWM3ZTZlOTBjOGE3ZDc1NzQ3ZTpzZXNzaW9uX2lkPTFfTVg0ME5UYzROamc0TW41LU1UUTRPRGN5TXpnNE5EYzVNbjVYWjJVelVqZDRVazlvU1V4YWVUaFFkVk5MVlVoV2JsTi1VSDQmY3JlYXRlX3RpbWU9MTQ4ODcyMzg4NSZub25jZT0wLjc3NjQwNDA5OTkwNDE0OSZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNDg4ODEwMjg1"
    },
    {
      datetime: "2017-06-25T18:24:03.805Z",
      sessionId: "1_MX40NTc4Njg4Mn5-MTQ4ODcyMzg4NDc5Mn5XZ2UzUjd4Uk9oSUxaeThQdVNLVUhWblN-UH4",
      name: "crocodile142",
      _id: "58bc1faceaad2d00119618f9",
      participants: [],
      tokenId: "T1==cGFydG5lcl9pZD00NTc4Njg4MiZzaWc9NGE0MDczY2E4MWIzY2EyODk4ZDIyYWM3ZTZlOTBjOGE3ZDc1NzQ3ZTpzZXNzaW9uX2lkPTFfTVg0ME5UYzROamc0TW41LU1UUTRPRGN5TXpnNE5EYzVNbjVYWjJVelVqZDRVazlvU1V4YWVUaFFkVk5MVlVoV2JsTi1VSDQmY3JlYXRlX3RpbWU9MTQ4ODcyMzg4NSZub25jZT0wLjc3NjQwNDA5OTkwNDE0OSZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNDg4ODEwMjg1"
    },
    {
      datetime: "2017-02-20T12:25:22.805Z",
      sessionId: "1_MX40NTc4Njg4Mn5-MTQ4ODcyMzg4NDc5Mn5XZ2UzUjd4Uk9oSUxaeThQdVNLVUhWblN-UH4",
      name: "weasel821",
      _id: "58bc1faceaad2d00119618f9",
      participants: [],
      tokenId: "T1==cGFydG5lcl9pZD00NTc4Njg4MiZzaWc9NGE0MDczY2E4MWIzY2EyODk4ZDIyYWM3ZTZlOTBjOGE3ZDc1NzQ3ZTpzZXNzaW9uX2lkPTFfTVg0ME5UYzROamc0TW41LU1UUTRPRGN5TXpnNE5EYzVNbjVYWjJVelVqZDRVazlvU1V4YWVUaFFkVk5MVlVoV2JsTi1VSDQmY3JlYXRlX3RpbWU9MTQ4ODcyMzg4NSZub25jZT0wLjc3NjQwNDA5OTkwNDE0OSZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNDg4ODEwMjg1"
    }
  ]
}])

// app.controller('VideoController', ['$scope', '$log','sessionFactory','OTSession', function($scope, $log, sessionFactory, OTSession) {
app.controller('VideoController', ['$scope', '$http', '$window', '$log', 'OTSession', function($scope, $http, $window, $log, OTSession, sessionFactory) {
  console.log(OTSession)
  $scope.streams = OTSession.streams;
  $scope.connections = OTSession.connections;
  $scope.publishers = OTSession.publishers;
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

  $scope.toggleVideo() = function() { 
    for(var publisher in $scope.publishers) {
      var stream = publisher.stream
      if(stream.hasVideo) {
        publisher.publishVideo(false)
      }
      else {
       publisher.publishVideo(true)
      }
    }
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
