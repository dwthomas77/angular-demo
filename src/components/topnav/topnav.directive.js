(function () {
    'use strict';

    angular
        .module('app.topnav')
        .directive('tmplTopnav', directiveFunction)
        .controller('TopnavController', ControllerFunction);


    // ----- directiveFunction -----
    directiveFunction.$inject = ['$rootScope', '$compile', '$templateCache', 'userAuthService', 'brandService'];

    /* @ngInject */
    function directiveFunction($rootScope, $compile, $templateCache, userAuthService, brandService) {

        var templateUrl = userAuthService.userAuthenticated ?
            'components/topnav/topnav-auth.html' : 'components/topnav/topnav.html';

        var curAuthState = userAuthService.userAuthenticated;

        var directive = {
            restrict: 'E',
            templateUrl: templateUrl,
            scope: {
            },
            controller: 'TopnavController',
            controllerAs: 'vm',
            link: function(scope, elem) {
                // fired when user logs in
                $rootScope.$on('authChange', function(event, userAuth) {
                    var templateUrl = userAuth ?
                        'components/topnav/topnav-auth.html' : 'components/topnav/topnav.html';
                    elem.html($templateCache.get(templateUrl));
                    $compile(elem.contents())(scope);
                });
                // fired when brand changes
                $rootScope.$on('brandChange', function() {
                    scope.vm.logo = brandService.getBrandValues().logo;
                    scope.vm.appName = brandService.getBrandValues().appName;
                    var templateUrl = userAuthService.userAuthenticated ?
                        'components/topnav/topnav-auth.html' : 'components/topnav/topnav.html';
                    elem.html($templateCache.get(templateUrl));
                    $compile(elem.contents())(scope);
                });
                // fired when view changes
                $rootScope.$on('$viewContentLoaded', function() {
                    if (curAuthState !== userAuthService.userAuthenticate) {
                        var templateUrl = userAuthService.userAuthenticated ?
                            'components/topnav/topnav-auth.html' : 'components/topnav/topnav.html';
                        elem.html($templateCache.get(templateUrl));
                        $compile(elem.contents())(scope);
                    }
                });
            }
        };

        return directive;
    }

    // ----- ControllerFunction -----
    ControllerFunction.$inject = ['$modal', 'brandService', '$state', '$rootScope'];

    /* @ngInject */
    function ControllerFunction($modal, brandService, $state, $rootScope) {
        var vm = this;

        vm.userName = 'John Doe';
        vm.brand = brandService.getBrand() ? brandService.getBrand() : '';
        vm.logo = brandService.getBrandValues().logo;
        vm.appName = brandService.getBrandValues().appName;

        $rootScope.$on('brandChange', function(event, brand) {
            vm.brand = brand;
        });

        vm.openLoginOverlay = function(size) {
            $modal.open({
                animation: false,
                size: size,
                template: '<tmpl-login-overlay close="$close()"></tmpl-login-overlay>'
            });
        };

        vm.openSearchOverlay = function(size) {
            $modal.open({
                animation: false,
                size: size,
                template: '<tmpl-search-overlay close="$close()"></tmpl-searcb-overlay>'
            });
        };

        vm.openUserViewOverlay = function(size) {
            $modal.open({
                animation: false,
                size: size,
                templateUrl: 'components/topnav/userDefinedView.html'
            });
        };

        vm.goToHomePage = function() {
            if (vm.brand) {
                $state.go('dashboard', {brand: vm.brand});
            } else {
                $state.go('dashboard');
            }
        };

    }

})();
