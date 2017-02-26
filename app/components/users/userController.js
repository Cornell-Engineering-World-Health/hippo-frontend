app.module('app.module', ['userService']).controller('userController', function ($scope, users) {
  $scope.users = users

  $scope.addUser = function () {
    users.create({
      username: $scope.username,
      email: $scope.email
    })
    $scope.username = ''
    $scope.email = ''
  }
})
