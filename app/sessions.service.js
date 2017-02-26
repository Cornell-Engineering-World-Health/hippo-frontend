(function () {
  'use strict';
     angular.module('app', [
        'app.core.services',
        'app.core.directives'
    ]);
    
    create.$inject ['$http']
    function create ($http) {
      var service =  {
        return $http.post(/videos)
          .then(function (response) {
            sessions.push (response.data)
            return response.data  
          })
      }
    }
   
    get.$inject ['$http']
    function get ($http) {

    }
}) ();
