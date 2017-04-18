// NO LONGER USED

// Used for transfer of information from session view to videocall
app.factory('UserVideoService', ['$http', 'UserService', function($http, UserService) {
  var sessionID
  var baseURL = UserService.baseUrlAPI

  function set(data) {
    sessionID = data
  }
  function get() {
    return sessionID
  }
  function getToken() {
    return $http.get(baseURL+ '/videos/' + sessionID)
      .then(function (response) {
        return response.data
      })
      .catch(function(error) {
        console.error('Failed to get token. Error: ' + error.data);
      })
  }

  return {
    set: set,
    get: get,
    getToken: getToken
  }
}])
