app.factory('VideoService', ['$http', 'UserService', function($http, UserService) {
  var baseURL = UserService.baseUrlAPI
  var service = {
    createSession: function(sessionData) {
      return $http.post(baseURL + '/videos', sessionData)
    },
    // TODO: BELOW NEEDS UPDATE
    getNewToken: function(session_name) {
      return $http.get(baseURL+ '/videos/' + session_name)
        .then(function (response) {
          return response.data
        })
        .catch(function(error) {
          console.error('Failed to get token. Error: ' + error.data);
        })
    },
    // TODO: why are we not using session_name.
    deleteSession: function(session_name) {
      return $http.delete(baseURL+ '/videos/' + session_name)
        .then( function (response){
          return response.data
        })
        .catch(function(error) {
          console.error('Failed to delete session. Error: ' + error.data);
        })
    }
  };
  return service;
}])