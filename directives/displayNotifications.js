app.directive('displayNotifications', ['socketService', function (socketService) {
  return {
    restrict: 'EA', // directive can only be used as an element or attribute
    link: function (scope, element, attrs) {
      $scope.$watch('notifications', function () {
        // write all the contents of the notifications array to the screen
        for (notification in notifications) {
          element.append('<p class = "notification">' + notification + '</p>')
        }
        // empty notificatiosn
        $scope.notifications = []
      }, true)
    }
  }
}])
