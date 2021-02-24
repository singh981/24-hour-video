'use strict';

let jwt = require('jsonwebtoken');
const axios = require('axios').default;

exports.handler = async (event, context, callback) => {
    /*
    1. Validate JSON Web Tokens. 
    2. Invoke an Auth0 endpoint to retrieve information about the user. 
    3. Send a response to the website.
    */

    console.log('Update User');
};