(function () {
  'use strict';

  angular
    .module('app.video', [])
    .controller('VideoController', VideoController);

  VideoController.$inject = [
    '$scope',
    '$log',
    'sessionFactory'
    'opentok'];

  function VideoController($scope, $log, sessionFactory) {
    var video = this;


    video.clientConnected = false;

    function conversationStarted(conversation) {
      // When a participant disconnects, note in log
      conversation.on('participantDisconnected', function (participant) {
        // Delete session from DB
        sessionFactory.delete(session_name)
          .success(function(data) {
            $scope.res = data;
          });

        $scope.$apply(function () {
          video.log = 'Participant "' + participant.identity + '" disconnected';
        });
      });
    }
  }
})()
