app.factory('SocketService', ['$rootScope', function($rootScope) {
  $rootScope.socket = io.connect();
  console.log($rootScope.socket);

  return {
    on: function(eventName, callback){
      $rootScope.socket.on(eventName, callback);
    },
    emit: function(eventName, data) {
      $rootScope.socket.emit(eventName, data);
    }
  };
}]);

