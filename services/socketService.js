app.factory('SocketService', ['$rootScope', function ($rootScope) {
  // $rootScope.socket = io.connect('http://localhost:3000', {'force new connection': true})
  if ($rootScope.socket == null) {
    console.log('just before socket creation')
    $rootScope.socket = io.connect('10.132.2.122:3000', { transports: ['websocket', 'polling', 'flashsocket'] })
    $rootScope.socket.emit('user-online', {email: 'bje43@cornell.edu' })
    console.log($rootScope.socket)
  }
  return {
    on: function (eventName, callback) {
      $rootScope.socket.on(eventName, callback)
    },
    emit: function (eventName, data) {
      $rootScope.socket.emit(eventName, data)
    }
  }
}])

