angular.module('myApp')
  .factory('UserService', function() {
    return {
      baseUrlAPI : 'https://ewh-hippo.herokuapp.com/api',
      baseUrl : 'https://ewh-hippo.herokuapp.com'
      // baseUrlAPI : 'http://localhost:3000/api',
      // baseUrl : 'http://localhost:3000'
    }
  })