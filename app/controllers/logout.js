/*
 * Controller to logout user. Clears user data from local storage.
 */
angular.module('myApp')
  .controller('LogoutCtrl', ['$location', '$auth', '$window',
   function($location, $auth, $window) {
    if (!$auth.isAuthenticated()) { return; }
    $auth.logout()
      .then(function() {
        delete $window.localStorage.currentUser
        console.log('You have been logged out');
        $location.path('/');
      })
  }])
