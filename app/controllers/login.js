angular.module('myApp')
  // .controller('LoginCtrl', ['$timeout',
  //   function($scope, $location, $auth, $timeout) {
  // Error with dependency; but dependency needed for minification
    .controller('LoginCtrl', function($scope, $location, $auth, $timeout) {
    $scope.login = function() {
      $auth.login($scope.user)
        .then(function() {
          console.log('You have successfully signed in!');
          $timeout(function() {
            $location.path('/user').replace()
          })
        })
        .catch(function(error) {
          console.log(error.data.message, error.status);
        })
    }
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function() {
          console.log('You have successfully signed in with ' + provider);
          $timeout(function() {
            $location.path('/user').replace()
          })
        })
        .catch(function(error) {
          if (error.message) {
            // Satellizer promise reject error.
            console.log(error.message);
          } else if (error.data) {
            // HTTP response error from server
            console.log(error.data.message, error.status);
          } else {
            console.log(error);
          }
        })
    }
  })