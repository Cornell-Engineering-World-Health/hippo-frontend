/*

APP MODULE handle the setup of app, load in angular dependencies, etc.

*/

(function () {
    'use strict';

    var app = angular.module('app', [
        'app.core.services',
        'app.core.directives',
        'ngRoute',
        'opentokjs'
    ]);
    app.config(function ($routeProvider) {
      $routeProvider
        .when('/home', {
          templateUrl: "index.html",
          controller: "VideoController" //change the name of the controller
        })
    })
})();
