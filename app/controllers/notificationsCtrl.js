app.controller('NotificationsCtrl', ['$scope', '$log', 'SocketService', function ($scope, $log, SocketService) {
  $scope.notifications = ['You have successfully joined the room!'];
  // console.log($scope.notifications)
  SocketService.on('user-has-connected', function (data) {
    console.log("joiner is " + data.joiner)
    $scope.notifications.push(data.joiner + ' has connected')
    $scope.$apply()
//    $scope.notifications = []
  })
  SocketService.on('user-has-disconnected', function (data) {
    console.log("leaver is " + data.leaver)
    $scope.notifications.push(data.leaver + ' has disconnected')
    $scope.$apply()
  //  $scope.notifications = []
  })
  SocketService.on('confirmation', function (data) {
    // console.log(data.msg)
    //$scope.notifications.push('confirmation has been recieved')
    //$scope.$apply()
   // $scope.notifications = []
  })
  
  $scope.clearNotifications = function(){$scope.notifications = []}
  setInterval(function(){ $scope.clearNotifications();}, 7000)
}])
