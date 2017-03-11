app.controller('UserCtrl', ['$scope', '$log', '$http', function ($scope, $log, $http) {

  var baseURL = 'https://ewh-hippo.herokuapp.com/api'

  // Returns user information for the User profile
  $scope.getUser = function(user_id) {
    $http.get(baseURL + '/users/' + user_id)
        .then(function (response) {
            return response.data
        })
        .catch(function (error) {
            console.log('Failed to get user ' + user_id + '. Error: ' + error.data)
            return error
        })
  }
  // Returns all available sessions given user_id
  $scope.getAllSessionsForUser = function(user_id) {
      $http.get(baseURL + '/users/' + user_id)
        .then(function (response) {
            console.log(response.data.calls)
            return response.data.calls
        })
        .catch(function (error) {
            console.log('Failed to get sessions for user ' + user_id + '. Error: ' + error.data)
            return error.data
        })
  }
  // Hard coded for user 8 
  $scope.userSessions = $scope.getAllSessionsForUser(8)
}])
