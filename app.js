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


var app = angular.module( "myApp", ['opentok', 'ui.router'] );

app.config( function ( $stateProvider, $urlRouterProvider ) {
  $stateProvider
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
});
