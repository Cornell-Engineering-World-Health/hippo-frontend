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
    .state('videolist', {
      url: '/user',
      templateUrl: 'partials/videolist.html',
      controller: 'UserCtrl'
    }) 
    .state('video', {
      url: '/videocall',
      templateUrl: 'partials/video.html',
      controller: 'VideoCtrl'
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