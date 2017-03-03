/*

APP MODULE handle the setup of app, load in angular dependencies, etc.

*/

(function () {
    'use strict';

    angular.module('app', [
        'app.core.services',
        'app.core.directives',
        'app.video',
        'opentokjs'
    ]);
})();
