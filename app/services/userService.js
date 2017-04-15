angular.module('myApp')
  .factory('UserService', function() {
    return {
       baseUrlAPI : 'https://ewh-hippo.herokuapp.com/api',
       baseUrl : 'https://ewh-hippo.herokuapp.com'
      // baseUrlAPI : 'http://10.132.8.13:3000/api',
      // baseUrl : 'http://10.132.8.13:3000'
    }
  })
