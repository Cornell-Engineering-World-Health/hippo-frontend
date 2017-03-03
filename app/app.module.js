/*

APP MODULE handle the setup of app, load in angular dependencies, etc.

*/

(function () {
    'use strict';

    var app = angular.module('app', [
        'app.core.services',
        'app.core.directives',
        'ngRoute',
        'app.video',
        'opentokjs'
    ]);
    app.config(function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: "/index.html",
          controller: "VideoController as vc" //change the name of the controller
        })
    })
})();
