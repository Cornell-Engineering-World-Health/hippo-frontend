app.factory('VideoService', ['$http', function($http) {
  var service = {
    createSession: function(sessionData) {
      // TODO: why are we exposing this in post url; no need
      return $http.post('/videos/' + sessionData.caller_id + '/users/' + sessionData.callee_id, sessionData)
        .then(function(response) {
          return alert("success");
        })
        .catch(function(error) {
          console.error('Failed post. Error: ' + error.data);
        })
    },
    getNewToken: function(session_name) {
      return $http.get('/videos/' + session_name)
        .then(function (response) {
          return response.data
        })
        .catch(function(error) {
          console.error('Failed to get token. Error: ' + error.data);
        })
    },
    // TODO: why are we not using session_name.
    deleteSession: function(session_name) {
      return $http.delete('/videos/' + session_name)
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