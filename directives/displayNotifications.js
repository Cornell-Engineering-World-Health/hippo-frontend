app.directive('displayNotifications', [function (socketService) {
  return {
    restrict: 'EA', // directive can only be used as an element or attribute
    link: function (scope, element, attrs) {
      scope.$watch('notifications', function () {
        console.log(scope.notifications)
        // write all the contents of the notifications array to the screen
        console.log('just logged notifications')
        for (var i = 0; i < scope.notifications.length; i++) {
         // element.append('<p class = "notification">' + scope.notifications[i] + '</p>')
          // ngNotify.set(scope.notifications[i])
          element.append('<div class="alert alert-info alert-dismissable"><a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>' + scope.notifications[i] + '</div>')
          console.log(scope.notifications[i])
        }
        // empty notificatiosn
        scope.notifications = []
      }, true)
    }
  }
}])
