angular.module('myApp')
  .controller('LoginCtrl', function($scope, $location, $auth) {
    $scope.login = function() {
      $auth.login($scope.user)
        .then(function() {
          console.log('You have successfully signed in!');
          print($scope.user)
          console.log($scope.user)
          $location.path('/');
        })
        .catch(function(error) {
          console.log(error.data.message, error.status);
        })
    } // WILL NOT NEED ABOVE
    $scope.authenticate = function(provider) {
      console.log(provider)
      $auth.authenticate(provider)
        .then(function() {
          console.log('You have successfully signed in with ' + provider);
          $location.path('/').replace()
          // $scope.$apply()
          // $scope.$apply(function() {
          //   $location.path('/');
          // })
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