app.controller('UserCtrl', ['$scope', '$log', '$http', '$location', '$timeout', 'User', 'UserService', 'VideoService', 'UserVideoService',
  function ($scope, $log, $http, $location, $timeout, User, UserService, VideoService, UserVideoService) {

  var baseURL = UserService.baseUrlAPI
  $scope.session = {
    invitedUserIds: [],
    startTime: "null",
    endTime: "null"
  }

  function checkActiveSession(session) {
    var d = new Date()
    return session.endTime > d.toISOString() || session.active
  }

  function checkSelf(user) {
    return user.email != $scope.user.email
  }

  function parseParticipants(session) {
    var particp = session.participants
    particp = particp.map(function(user) {
      return user.firstName + " " + user.lastName
    })
    particp = particp.filter(function(user) {
      return user != $scope.user.firstName + ' ' + $scope.user.lastName
    })
    session.participants = particp.join(', ')
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
          $scope.userSessions.map(parseParticipants)
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
      $scope.allUsers = response.data.users
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
}])
