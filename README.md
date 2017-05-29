# hippo-frontend

The web-interface for hippo, a HIPAA-compliant video conferencing system. Powered by [hippo-backend](https://github.com/Cornell-Engineering-World-Health/hippo-backend "hippo-backend")'s REST API. Built with OpenTok, AngularJS, NodeJS, Socket.io, and Google OAth. 

Features include:
* Secure video calls
* User accounts
* Real-time notifications
* Call scheduling
* Call history records
* Video interface controls

View our live web deployment at https://aqueous-stream-90183.herokuapp.com.

See our Android version, [hippo-android](https://github.com/Cornell-Engineering-World-Health/hippo-android).

Learn more about our team, [Cornell Engineering World Health](https://ewh.engineering.cornell.edu/).

For local deployment, follow these instructions:

## Setup

1. Configure the backend repo according to [hippo-backend](https://github.com/Cornell-Engineering-World-Health/hippo-backend).

2. Clone this repository (outside of hippo-backend).

3. Run `npm install` in the root directory.

4. Replace `apiKey` and `apiSecret` with your own keys in `app/config.json`. Make sure to use the same OpenTok API key and secret key as you used in your hippo-backend `.env` file.

5. Replace `baseInterfaceUrl` with `http://localhost:8080` in `app/services/userService.js`.

## Run

1. Run `npm start` in the root directory.

2. Navigate to http://localhost:8080.
