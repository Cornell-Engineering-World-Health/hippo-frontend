(function () {
  'use strict'

  angular
    .module('app.core.services', [])
    .factory('sessionFactory', sessionFactory)

  sessionFactory.$inject = ['$http']
  var baseURL = 'https://ewh-hippo.herokuapp.com/api'

  /* given a caller_id and callee_id creates a openTok Session accesible to both users */
  function sessionFactory ($http) {
    var service = {
      createSession: function (sessionData) {
        // TODO: why are we exposing this in post url; no need
        return $http.post(baseURL + '/videos/' + sessionData.caller_id + '/users/' + sessionData.callee_id, sessionData)
          .then(function (response) {
            return alert('success')
          })
          .catch(function (error) {
            console.error('Failed post. Error: ' + error.data)
          })
      },
      getNewToken: function (sessionName) {
        return $http.get(baseURL + '/videos/' + sessionName)
          .then(function (response) {
            return response.data
          })
          .catch(function (error) {
            console.error('Failed to get token. Error: ' + error.data)
          })
      },
      deleteSession: function (sessionName) {
        return $http.delete(baseURL + '/videos/' + sessionName)
          .then(function (response) {
            return response.data
          })
          .catch(function (error) {
            console.error('Failed to delete session. Error: ' + error.data)
          })
      }
    }
    return service
  }
})()

