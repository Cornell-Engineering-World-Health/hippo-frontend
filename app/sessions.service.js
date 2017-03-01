(function () {
  'use strict';
     angular.module('app', [
        'app.core.services',
        'app.core.directives'
    ]);
    
    /*given a caller_id and callee_id creates a openTok Session accesible to both users*/
    createSession.$inject ['$http']
    function createSession ($http, caller_id, callee_id) {
      var service =  {
        return $http.post(/videos/caller_id/callee_id)
          .then(function (response) {
            return response.data  
          })
      }
    }
    /*given a session_id generates a new token for that session*/
    getNewToken.$inject ['$http']
    function getNewToken ($http, session_id) {
     var service =  {
        return $http.get(/videos/session_id)
          .then(function (response) {
            return response.data  
          })
      }
    }
    /*deletes session with given session_name*/
    deleteSession.$inject ['$http']
    function deleteSession ($http, session_name){
      var service = {
        return $http.delete(/videos/session_name)
        .then( function (response{
          return response.data
        })
      }
    } 
   
}) ();
