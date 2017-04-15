app.factory('VideoService', ['$http', 'UserService', function($http, UserService) {
  var baseURL = UserService.baseUrlAPI
  var service = {
    createSession: function(sessionData) {
      return $http.post(baseURL + '/videos', sessionData)
    },
    
    getNewToken: function(session_name) {
      return $http.get(baseURL+ '/videos/' + session_name)
        .then(function (response) {
          return response.data
        })
        .catch(function(error) {
          console.error('Failed to get token. Error: ' + error.data);
        })
    },
    
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