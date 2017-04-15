// Used for transfer of information from session view to videocall
app.factory('UserVideoService', ['$http', function($http) {
  // var sessionID = $scope.session_name || ""
  var sessionID
  console.log(sessionID)
  function set(data) {
    sessionID = data
  }
  function get() {
    return sessionID
  }

  return {
    set: set,
    get: get
  }
}])
