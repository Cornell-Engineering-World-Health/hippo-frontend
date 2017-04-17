angular.module('myApp')
  .controller('NavbarCtrl', ['$scope', '$auth', 'User', function($scope, $auth, User) {
    // Returns user information for the User profile
    $scope.getUser = function() {
      console.log("in get user")
      console.log("authenticated")
      User.getUser()
          .then(function (response) {
            $scope.user = response.data
          })
          .catch(function (error) {
              console.log(error)
              return error
          })
    }
    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated()
    }
  }])