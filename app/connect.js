var session = OT.initSession(sessionId)
var publisher = OT.initPublisher("publisher")

session.connect(token, function(error) {
    if (!error) {
        var publisher = OT.initPublisher('publisher', {
            insertMode: 'append',
            width: '100%',
            height: '100%'
        });

    session.publish(publisher);
    } else {
        console.log('There was an error connecting to the session:', error.code, error.message);
    }
});
