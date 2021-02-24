'use strict';

let jwt = require('jsonwebtoken');
const axios = require('axios').default;

exports.handler = async (event, context, callback) => {
    /*
    1. Validate JSON Web Tokens. 
    2. Invoke an Auth0 endpoint to retrieve information about the user. 
    3. Send a response to the website.
    */

    if (!event.authToken) {
        console.log('No Access Token provided !!!');
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Could not find access token',
            }),
        };
    }

    const accessToken = event.authToken.replace(/\s\s+/g, ' ').split(' ')[1];
    const url = `https://${process.env.DOMAIN}/userinfo`;

    console.log('AccessToken', accessToken);
    try {
        const userInfo = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log('userInfo', userInfo.data);
        return {
            statusCode: 200,
            body: userInfo.data,
        };
    } catch (err) {
        console.log('ERROR : Unable to access userInfo', err);
        return {
            statusCode: 400,
            body: {
                message: 'Error getting user information from Auth0',
            },
        };
    }
};