/*
 * Service that creates a socket.io socket and wraps basic socket methods as needed
 */
app.factory('SocketService', ['$rootScope', '$http', function ($rootScope, $http) {
  /* One socket is created per user if one does not already exist. The socket is created when this service is first
  injected into a controller. The socket immediately emits a message with the user's email to allow backend to link
  the socket's ID to that user. */
  if ($rootScope.socket == null) {
    $rootScope.socket = io.connect('https://ewh-hippo.herokuapp.com/', { transports: ['websocket', 'polling', 'flashsocket'] })

    var userEmail = ''
    $http.get('https://ewh-hippo.herokuapp.com/api/self').success(function (data) {
      userEmail = data.email
      console.log(userEmail)
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
