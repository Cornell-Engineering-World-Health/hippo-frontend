app.controller('NotificationsCtrl', ['$scope', '$log', 'SocketService', function ($scope, $log, SocketService) {
  $scope.notifications = ['You are the first to join the session!']
  // console.log($scope.notifications)
  SocketService.on('user-has-connected', function (data) {
    console.log(data)
    $scope.notifications.push(data.joiner + ' has connected')
  })
  SocketService.on('participant-disconnected', function (disconnectInfo) {
    $scope.notifications.push('A participant has disconnected')
  })
  SocketService.on('confirmation', function (data) {
    // console.log(data.msg)
    $scope.notifications.push('confirmation has been recieved')
  })
}])
