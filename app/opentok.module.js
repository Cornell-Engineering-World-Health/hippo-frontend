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

        return new Opentok(45786882, aafd067184ed09d50dd472d8808afb733568599b)
    })
})
