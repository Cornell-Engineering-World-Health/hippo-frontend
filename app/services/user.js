angular.module('myApp')
  .factory('User', ['$http', 'UserService', function($http, UserService) {
    var selfUrl = UserService.baseUrlAPI + '/self'
    var allUrl = UserService.baseUrlAPI + '/users'
    return {
      getUser: function() {
        return $http.get(selfUrl)
      },
      getAllUsers: function() {
        return $http.get(allUrl)
      }
    }
  }])