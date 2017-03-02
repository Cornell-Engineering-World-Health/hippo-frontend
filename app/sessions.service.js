angular.module('app').factory(function () {
    
    /*given a caller_id and callee_id creates a openTok Session accesible to both users*/
    createSession.$inject ['$http']
    function createSession ($http, caller_id, callee_id) {
      var body = {'user1' : caller_id, 'user2' : callee_id }
      var service =  {
        return $http.post('/videos/' + caller_id +'/users/' + callee_id, body)
          .then(function (response) {
            return response.data  
          })
          .catch(function(error){
            console.error('Failure to create session using the following IDs ' + response.data)
          })
      }
      return service
    }
    /*given a session_id generates a new token for that session*/
    getNewToken.$inject ['$http']
    function getNewToken ($http, session_id) {
      var service =  {
        return $http.get('/videos/' + session_id)
          .then(function (response) {
            return response.data  
          })
          .catch(function(error){
            console.error('Failure get session by ID ' + response.data)
          })

      }
      return service
    }
    /*deletes session with given session_name*/
    deleteSession.$inject ['$http']
    function deleteSession ($http, session_name){
      var service = {
        return $http.delete('/videos/' + session_name)
        .then( function (response){
          return response.data
        })
        .catch(function(error){
          console.error('Failure to delete session with ID ' + response.data)
        })
      }
      return service
    } 
   
})
