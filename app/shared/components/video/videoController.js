
(function(){
    'use strict';

    var app = angular.module('app', [
        'app.core.services',
        'app.core.directives',
        'ngRoute',
        'opentokjs'
    ]);
    app.config(function ($routeProvider) {
      $routeProvider
        .when('/*', {
          templateUrl: "index.html",
          controller: "VideoController as vc" //change the name of the controller
        })
    })
    app.controller('VideoController', ['$scope', '$log','sessionFactory','$window', function($scope, $log, sessionFactory, $window) {
        var Opentok = $window.opentok
        var opentok = new Opentok(45786882, aafd067184ed09d50dd472d8808afb733568599b)

        // Create the session
        newSession = function(sessionData) {
            var resp = createSession(sessionData) //error handling
            $scope.sessionID = resp.sessionID
            $scope.session = opentok.initSession($scope.sessionID)
        }


        // Connect to session
        connectToSession = function() {
            $scope.token = getNewToken($scope.sessionID)
            $scope.session.connect($scope.token, function(error) {
                if (error) {
                    console.log('[ERROR] Connect to session error', error)
                }
                else {
                    console.log('Connected to session', $scope.sessionID)
                }
            })
        }

        $scope.createVideo = function() {
            console.log("inVideo")
            newSession()
            connectToSession()
        }

        // Create publisher
        $scope.createPublisher = function() {
            // hard-coded properites for now
            var targetElement = 'publisher'
            var properties = {  insertMode: 'append',
                                width: '100%',
                                height: '100%' }
            return opentok.initPublisher(targetElement, properties, function(error){
                if(error) {
                    console.log('[ERROR] Initializing publisher error', error)
                } else {
                    console.log('Initialized publisher...')
                }
            })
        }

        $scope.publisher = createPublisher()

        // Publish
        $scope.publishToSession = function() {
            $scope.session.publish($scope.publisher, function() {
                if(error) {
                    console.log('[ERROR] Publishing to session error', error)
                }
                else {
                    console.log('Published to stream...')
                }
            })
        }

        $scope.endSession = function() {
            $scope.session.disconnect()
            $scope.session.on("sessionDisconnected", function (event) {
              // The event is defined by the SessionDisconnectEvent class
              if (event.reason == "networkDisconnected") {
                alert("Your network connection terminated.")
              }
              // LOGIC TO CHANGE VIEW GOES HERE
              // Can also add connectionDestroyed
              // Need to define session_name
            });
            sessionFactory.delete(session_name)
              .success(function(data) {
                $scope.res = data;
              });
        }
    }])
})()