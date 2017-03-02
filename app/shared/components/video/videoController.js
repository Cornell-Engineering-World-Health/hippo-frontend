app.controller('VideoController', [
    '$scope',
    'sessionFactory',
    function($scope, sessionFactory){

    // Create the session
    $scope.newSession = function(sessionData) {
        var resp = createSession(sessionData) //error handling
        $scope.sessionID = resp.sessionID
        $scope.session = opentok.initSession($scope.sessionID)
    }


    // Connect to session
    $scope.connectToSession = function() {
        $scope.token = getNewToken($scope.sessionID)
        $scope.session.connect($scope.token, function(error) {
            if (error) {
                console.log('[ERROR] Connect to session error', error)
            }
            else {
                console.log('Connected to session', $scope.sessionID)
            }
        }
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
    $scope.publishToSession= function() {
        $scope.session.publish($scope.publisher, function() {
            if(error) {
                console.log('[ERROR] Publishing to session error', error)
            }
            else {
                console.log('Published to stream...')
            }
        }
    }

}])