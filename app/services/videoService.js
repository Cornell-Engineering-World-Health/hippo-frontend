/* 
 * Service for making http requests to the restAPI related to video sessions
 */
app.factory('VideoService', ['$http', 'UserService', function($http, UserService) {
  var baseURL = UserService.baseUrlAPI
  var service = {
    // Creates a session with the given user
    createSession: function(sessionData) {
      return $http.post(baseURL + '/videos', sessionData)
    },
    
    // Returns information about a session with the given session_name including a new token for joining that session
    getNewToken: function(session_name) {
      return $http.get(baseURL+ '/videos/' + session_name)
        .then(function (response) {
          return response.data
        })
        .catch(function(error) {
          console.error('Failed to get token. Error: ' + error.data);
        })
    },
    
    // Deletes the session with given session_name
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
