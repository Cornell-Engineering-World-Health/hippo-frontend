app.controller('NotificationsCtrl', ['$scope', '$log', 'SocketService', function ($scope, $log, SocketService) {
  $scope.notifications = ['You are the first to join the session!']
  // console.log($scope.notifications)
  SocketService.on('user-has-connected', function (data) {
    console.log("joiner is " + data)
    $scope.notifications.push(data.joiner + ' has connected')
//    $scope.notifications = []
  })
  SocketService.on('participant-disconnected', function (disconnectInfo) {
    $scope.notifications.push('A participant has disconnected')
  //  $scope.notifications = []
  })
  SocketService.on('confirmation', function (data) {
    // console.log(data.msg)
    $scope.notifications.push('confirmation has been recieved')
   // $scope.notifications = []
  })
  
  $scope.clearNotifications = function(){$scope.notifications = []}
  //setInterval(function(){ $scope.clearNotifications();}, 5000)
}])
