angular.module('myApp')
  .factory('User', ['$http', '$q', '$timeout', 'UserService', function($http, $q, $timeout, UserService) {
    var selfUrl = UserService.baseUrlAPI + '/self'
    var allUrl = UserService.baseUrlAPI + '/users'
    var cdrUrl = UserService.baseUrlAPI + '/cdrs/user/'
    var userUrl = UserService.baseUrlAPI + '/users/'
    return {
      getSelf: function() {
        return $http.get(selfUrl)
      },
      getAllUsers: function() {
        return $http.get(allUrl)
      },
      getCDR: function(_id) {
        return $http.get(cdrUrl + _id)
      },
      getUser: function(_id) {
        var deferred = $q.defer()
        $http.get(userUrl + _id)
          .then(function (response) {
            deferred.resolve(response)
          })
          .catch(function (error) {
            deferred.reject(error)
        })
        return deferred.promise
        // return $http.get(userUrl + _id)
      }
    }
  }])