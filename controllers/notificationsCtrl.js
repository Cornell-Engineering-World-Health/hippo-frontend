app.controller('NotificationsCtrl', ['$scope', '$log', 'socketService', function ($scope, $log, socketService) {
  $scope.notifications = []
  socketService.on('participant-connected', function () {
    $scope.notifications.push('A participant has connected')
  })
  socketService.on('participant-disconnected', function (disconnectInfo) {
    $scope.notififcations.push('A participant has disconnected')
  })
}])

