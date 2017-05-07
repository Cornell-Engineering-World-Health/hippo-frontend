/*
* UserService contains the urls for all backend calls and frontend interface directs.
*/
angular.module('myApp')
  .factory('UserService', function() {
    return {
       baseUrlAPI : 'https://ewh-hippo.herokuapp.com/api',
       baseUrl : 'https://ewh-hippo.herokuapp.com',
       baseInterfaceUrl : 'https://aqueous-stream-90183.herokuapp.com'
    }
  })
