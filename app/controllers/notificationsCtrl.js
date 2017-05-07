/* Controller that looks for notifications and creates the message to be sent to the screen*/
app.controller('NotificationsCtrl', ['$scope', '$log', 'SocketService', function ($scope, $log, SocketService) {
  /*Contents of $scope.notifications are displayed to screen*/
  $scope.notifications = ['You have successfully joined the call!']

  /* Listen to event that is emitted when a user joins the session connected*/
  SocketService.on('user-has-connected', function (data) {
    console.log("joiner is " + data.joiner)
    $scope.notifications.push(data.joiner + ' has connected')
    $scope.$apply()
  })
  /* Listen to event that is emitted when a user clicks the end call button*/
  SocketService.on('user-has-disconnected', function (data) {
    console.log("leaver is " + data.leaver)
    $scope.notifications.push(data.leaver + ' has disconnected')
    $scope.$apply()
  })

  /* Listen to event that is emitted when a socket connection is established
    Used for debugging*/
  /*SocketService.on('confirmation', function (data) {
    // console.log(data.msg)
    $scope.notifications.push('confirmation has been recieved')
    $scope.$apply()
  }) */
  
  /*Clear notifications every seven seconds*/
  $scope.clearNotifications = function(){$scope.notifications = []}
  setInterval(function(){ $scope.clearNotifications();}, 7000)
}])
