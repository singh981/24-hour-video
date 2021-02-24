'use strict';

let jwt = require('jsonwebtoken');
const axios = require('axios').default;

exports.handler = async (event, context, callback) => {
    /*
    1. get Auth0 management token. 
    2. Invoke an Auth0 endpoint to update user information. 
        2.1. Return 200 - Success OR 400 - Error
    */


    console.log('Update User');

    // 1
    // const auth0_Management_Token = event.headers.Authorization.replace(/\s\s+/g, ' ').split(' ')[1];
    // console.log('Management token', auth0_Management_Token);


    var options = {
        method: 'POST',
        url: 'https://dev-zad5pr4e.us.auth0.com/oauth/token',
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
            grant_type: 'client_credentials',
            client_id: `${process.env.AUTH0_CLIENT_ID}`,
            client_secret: `${process.env.AUTH0_CLIENT_SECRET}`,
            audience: 'https://dev-zad5pr4e.us.auth0.com/api/v2/'
        }
    };

    try {
        const response = await axios.request(options)
        console.log('Management token', response.data);
    } catch (err) {
        console.error(err);
    }


    // 2 - Make call to axios to update user
    // try {
    //     const response = await axios.patch(
    //         'https://dev-zad5pr4e.us.auth0.com/api/v2/users/auth0%7C5f58e114cb7de70069780cdd', {
    //             "user_metadata": {
    //                 "addresses": {
    //                     "work_address": "Toronto",
    //                     "home_address": "257 Purple Sage"
    //                 }
    //             }
    //         }, {
    //             headers: {
    //                 Authorization: `Bearer ${auth0_Management_Token}`,
    //             }
    //         }
    //     );

    //     console.log('Axios Patch response', response);


    // } catch (err) {
    //     console.log('Error', err);
    // }



    console.log('Body', event.body);

};