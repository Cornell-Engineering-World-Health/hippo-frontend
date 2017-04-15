app.directive('displayNotifications', [function (socketService) {
  return {
    restrict: 'EA', // directive can only be used as an element or attribute
    link: function (scope, element, attrs) {
      scope.$watch('notifications', function () {
        // write all the contents of the notifications array to the screen
        for (var i = 0; i < scope.notifications.length; i++) {
          element.append('<div class="alert alert-warning alert-dismissible" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + scope.notifications[i] + '</div>')
          // console.log(scope.notifications[i])
        }
        // empty notificatiosn
        scope.notifications = []
      }, true)
    }
  }
}])
