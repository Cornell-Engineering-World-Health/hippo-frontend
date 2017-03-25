app.factory('SocketService', ['$rootScope', '$http', function ($rootScope, $http) {
  // $rootScope.socket = io.connect('http://localhost:3000', {'force new connection': true})
  if ($rootScope.socket == null) {

    console.log('just before socket creation')
    $rootScope.socket = io.connect('https://ewh-hippo.herokuapp.com/', { transports: ['websocket', 'polling', 'flashsocket'] })

    var userEmail = ""
    $http.get('https://ewh-hippo.herokuapp.com/api/self').success(function (data) {
      userEmail = data.email
      $rootScope.socket.emit('user-online', {email: userEmail})
    })

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
