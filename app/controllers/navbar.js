/*
 * Controller to modify navigation bar. Based off authentication state.
 */
angular.module('myApp')
  .controller('NavbarCtrl', ['$scope', '$auth', 'User', function($scope, $auth, User) {
    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };
  }])
