(function () {

    'use strict';

    angular.module('app.login-overlay')
        .directive('tmplLoginOverlay', directiveFunction)
        .controller('LoginController', ControllerFunction);


    // ----- directiveFunction -----
    directiveFunction.$inject = [];

    /* @ngInject */
    function directiveFunction() {

        var directive = {
            restrict: 'E',
            templateUrl: 'components/login-overlay/login-overlay.html',
            scope: {
                close: '&'
            },
            controller: 'LoginController',
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;
    }


    // ----- ControllerFunction -----
    ControllerFunction.$inject = ['$state', 'userAuthService'];

    /* @ngInject */
    function ControllerFunction($state, userAuthService) {

        var vm = this;

        vm.userLogin = function() {
            userAuthService.authenticateUser();
            $state.go($state.current);
            vm.close();
        };

    }

})();
