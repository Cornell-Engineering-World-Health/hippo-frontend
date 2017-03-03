(function () {
    'use strict'

    angular.module('opentokjs', [
        'app.core.services',
        'app.core.directives',
    ])
    .factory('opentok', function ($window) {
        if($window.opentok){
            $window._thirdParty = $window._thirdParty || {}
            $window._thirdParty.opentok = $window.opentok
            try { delete $window.opentok } catch (error) {$window.opentok = undefined }
        }
        var Opentok = $window._thirdParty.opentok

        return new Opentok(apiKey, apiSecret)
    })
})
