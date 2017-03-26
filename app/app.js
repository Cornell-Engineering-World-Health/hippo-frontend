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
    .state('home', {
      url: '/',
      templateUrl: 'index.html',
      controller: 'LoginCtrl',
      resolve: {
        skipIfLoggedIn: skipIfLoggedIn
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: 'partials/login.html',
      controller: 'LoginCtrl',
      resolve: {
        skipIfLoggedIn: skipIfLoggedIn
      }
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'partials/signup.html',
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
    .state('scheduleSession', {
      url: '/schedule',
      templateUrl: 'partials/scheduleSession.html',
      controller: 'UserCtrl'
    })
    .state('video', {
      url: '/videocall',
      templateUrl: 'partials/video.html',
      controller: 'VideoCtrl'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'partials/profile.html',
      controller: 'UserCtrl'
    })

    $urlRouterProvider.otherwise('/');
    $authProvider.baseUrl = "https://ewh-hippo.herokuapp.com"
    // $authProvider.baseUrl = "http://localhost:3000"
    $authProvider.google({
      clientId: '789185821228-jkliab3iscephfdr47h9184kn1bh2t1j.apps.googleusercontent.com'
    });
});