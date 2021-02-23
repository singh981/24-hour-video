/**
 * Created by Peter Sbarski
 * Serverless Architectures on AWS
 * http://book.acloud.guru/
 * Last Updated: Feb 11, 2017
 */

var userController = {
    name: 'karan',
    data: {
        auth0Lock: null,
        config: null,
    },

    uiElements: {
        loginButton: null,
        logoutButton: null,
        profileButton: null,
        profileNameLabel: null,
        profileImage: null,
    },

    auth0: null,

    init: async function (config) {
        var that = this;

        this.uiElements.loginButton = $('#auth0-login');
        this.uiElements.logoutButton = $('#auth0-logout');
        this.uiElements.profileButton = $('#user-profile');
        this.uiElements.profileNameLabel = $('#profilename');
        this.uiElements.profileImage = $('#profilepicture');

        // we have the auth0 config
        this.data.config = config;

        // AUTH0 instance configured
        if (!this.auth0) {
            console.log('Creating Auth0 Instance');
            this.auth0 = await createAuth0Client({
                domain: config.auth0.domain,
                client_id: config.auth0.clientId,
                redirect_uri: window.location.origin,
                cacheLocation: 'localstorage',
            });
        }

        console.log('auth0 - Init', this.auth0);
        console.log(
            'auth0 - isAuthenticated - Init',
            await this.auth0.isAuthenticated()
        );

        const accessToken = localStorage.getItem('accessToken');
        console.log('Access token - Init', accessToken);

        if (accessToken) {
            that.showUserAuthenticationDetails(await that.getUser(accessToken));
        }

        this.wireEvents();
    },

    showUserAuthenticationDetails: function (profile) {
        var showAuthenticationElements = !!profile;

        if (showAuthenticationElements) {
            this.uiElements.profileNameLabel.text(profile.nickname);
            this.uiElements.profileImage.attr('src', profile.picture);
        }

        this.uiElements.loginButton.toggle(!showAuthenticationElements);
        this.uiElements.logoutButton.toggle(showAuthenticationElements);
        this.uiElements.profileButton.toggle(showAuthenticationElements);
    },

    getUser: async function (accessToken) {
        let that = this;

        const url = that.data.config.apiBaseUrl + '/user-info';
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return (await response.json()).body;
    },

    wireEvents: function () {
        var that = this;

        // Login Logic
        this.uiElements.loginButton.click(async function (e) {
            await that.auth0.loginWithPopup();

            const isAuthenticated = await that.auth0.isAuthenticated();
            const accessToken = await that.auth0.getTokenSilently();

            const user = await that.getUser(accessToken);

            console.log('User - SignIn', user);

            // set local storage with access token
            if (isAuthenticated) {
                localStorage.setItem('accessToken', accessToken);
                that.showUserAuthenticationDetails(user);
            }
        });

        // Logout logic
        this.uiElements.logoutButton.click(function (e) {
            localStorage.removeItem('accessToken');

            that.auth0.logout({
                returnTo: window.location.origin,
            });
        });

        this.uiElements.profileButton.click(function (e) {
            var url = that.data.config.apiBaseUrl + '/user-profile';

            $.get(url, function (data, status) {
                $('#user-profile-raw-json').text(JSON.stringify(data, null, 2));
                $('#user-profile-modal').modal();
            });
        });
    },
};
