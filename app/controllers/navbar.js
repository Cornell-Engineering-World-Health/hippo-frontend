angular.module('myApp')
  .controller('NavbarCtrl', ['$scope', '$auth', 'User', function($scope, $auth, User) {
    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };
    // Returns user information for the User profile
    $scope.getUser = function() {
      User.getUser()
          .then(function (response) {
            $scope.user = response.data
            $scope.userSessions = response.data.calls
            $scope.userSessions = $scope.userSessions.filter(checkActiveSession)
            $scope.getAllUsers()
          })
          .catch(function (error) {
              console.log(error)
              return error
          })
    }
    $scope.getUser()
  }])
