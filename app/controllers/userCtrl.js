app.controller('UserCtrl', ['$scope', '$log', '$http', 'User', 'UserService',
  function ($scope, $log, $http, User, UserService) {

  var baseURL = UserService.baseUrlAPI
  console.log(baseURL)

  // Returns user information for the User profile
  $scope.getUser = function() {
    User.getUser()
        .then(function (response) {
          $scope.user = response.data
          $scope.userSessions = response.data.calls
        })
        .catch(function (error) {
            console.log(error)
            return error
        })
  }
  // Returns all available sessions given user_id
  $scope.getAllSessionsForUser = function(user_id) {
      $http.get(baseURL + '/users/' + user_id)
        .then(function (response) {
            console.log(response)
            $scope.userSessions = response.data.calls
        })
        .catch(function (error) {
            console.log('Failed to get sessions for user ' + user_id + '. Error: ' + error.data)
            return error.data
        })
  }
  $scope.getUser()
  // $scope.getAllSessionsForUser(21)
}])
