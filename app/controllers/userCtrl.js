app.controller('UserCtrl', ['$scope', '$log', '$http', '$location', '$timeout', 'User', 'UserService', 'VideoService', 'UserVideoService',
  function ($scope, $log, $http, $location, $timeout, User, UserService, VideoService, UserVideoService) {
// app.controller('UserCtrl', ['$scope', '$log', '$http', '$location', '$timeout', 'User', 'UserService', 'VideoService',
//   function ($scope, $log, $http, $location, $timeout, User, UserService, VideoService) {

  var baseURL = UserService.baseUrlAPI
  $scope.session = {
    invitedUserIds: [],
    startTime: "null",
    endTime: "null"
  }

  function checkActiveSession(session) {
    var d = new Date()
    return session.endTime > d.toISOString() // || session.active
  }

  function checkSelf(user) {
    return user.email != $scope.user.email
  }

    function convertParticId(id) {

  }

  $scope.setSessionName = function(session_name) {
    UserVideoService.set(session_name)
  }


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

  $scope.getAllUsers = function() {
    User.getAllUsers()
    .then(function (response) {
      //console.log(response)
      $scope.allUsers = response.data.users
      //console.log($scope.allUsers)
      $scope.allUsers = $scope.allUsers.filter(checkSelf)

    })
    .catch(function (error) {
        console.log(error)
        return error
    })
  }
  $scope.createSession = function() {
    $scope.session.invitedUserIds = $scope.session.invitedUserIds.map(Number);
    $scope.session.startTime = $scope.session.startTime._d
    $scope.session.endTime = $scope.session.endTime._d
    VideoService.createSession(JSON.stringify($scope.session))
    .then(function (response) {
      console.log("Session Created")
      $timeout(function() {
        $location.path('/user').replace()
      })
    })
    .catch(function (error) {
        console.log(error)
        return error
    })
  }
  $scope.getUser()
  // $scope.getAllUsers()
}])
