angular.module('myApp')
  .controller('LogoutCtrl', function($location, $auth) {
    if (!$auth.isAuthenticated()) { return; }
    $auth.logout()
      .then(function() {
        console.log('You have been logged out');
        delete $window.localStorage.currentUser
        $location.path('/login');
      })
  })