(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('userAuthService', userAuthService);

    userAuthService.$inject = ['$rootScope'];

    function userAuthService($rootScope) {

        var service = {
            userAuthenticated: false,
            authenticateUser: authenticateUser
        };

        return service;

        function authenticateUser() {
            service.userAuthenticated = true;
            $rootScope.$broadcast('authChange', service.userAuthenticated);
        }

    }

})();

