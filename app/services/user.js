angular.module('myApp')
  .factory('User', ['$http', 'UserService', function($http, UserService) {
    var url = UserService.baseUrlAPI + '/self'
    return {
      getUser: function() {
        return $http.get(url)
      }
    }
  }])