(function () {

    'use strict';

    angular.module('app.dashboard')
        .directive('tmplHome', directiveFunction)
        .controller('DashboardController', ControllerFunction);


    // ----- directiveFunction -----
    directiveFunction.$inject = [
        '$rootScope',
        '$compile',
        '$templateCache',
        'userAuthService',
        '$state',
        'brandService'
    ];

    /* @ngInject */
    function directiveFunction($rootScope, $compile, $templateCache, userAuthService, $state, brandService) {

        // Branded Colors and Content
        if ($state.params.brand) {
            brandService.loadBranding($state.params.brand);
        }

        var templateUrl = userAuthService.userAuthenticated ?
            'components/dashboard/dashboard-auth.html' : 'components/dashboard/dashboard.html';

        var curAuthState = userAuthService.userAuthenticated;

        var directive = {
            restrict: 'E',
            templateUrl: templateUrl,
            scope: {
            },
            controller: 'DashboardController',
            controllerAs: 'vm',
            link: function(scope, elem) {
                // user service broadcast
                $rootScope.$on('authChange', function(event, userAuth) {
                    var templateUrl = userAuth ?
                        'components/dashboard/dashboard-auth.html' : 'components/dashboard/dashboard.html';

                    elem.html($templateCache.get(templateUrl));
                    $compile(elem.contents())(scope);
                });
                // check user state when view changes
                $rootScope.$on('$viewContentLoaded', function() {

                    if (curAuthState !== userAuthService.userAuthenticated) {
                        var templateUrl = userAuthService.userAuthenticated ?
                            'components/dashboard/dashboard-auth.html' : 'components/dashboard/dashboard.html';
                        elem.html($templateCache.get(templateUrl));
                        $compile(elem.contents())(scope);
                    }
                });
                // fired when brand changes
                $rootScope.$on('brandChange', function() {
                    scope.vm.appName = brandService.getBrandValues().appName;
                    scope.vm.productName = brandService.getBrandValues().productName;
                    var templateUrl = userAuthService.userAuthenticated ?
                            'components/dashboard/dashboard-auth.html' : 'components/dashboard/dashboard.html';
                    elem.html($templateCache.get(templateUrl));
                    $compile(elem.contents())(scope);
                });

                var templateUrl = userAuthService.userAuthenticated ?
                    'components/dashboard/dashboard-auth.html' : 'components/dashboard/dashboard.html';

                elem.html($templateCache.get(templateUrl));
                $compile(elem.contents())(scope);
            }

        };

        return directive;
    }


    // ----- ControllerFunction -----
    ControllerFunction.$inject = ['brandService', '$state', 'recentSearchesService'];

    /* @ngInject */
    function ControllerFunction(brandService, $state, recentSearchesService) {

        var vm = this;

        vm.userName = 'John Doe';
        vm.brand = brandService.getBrand() === 'freddie' ? 'freddie' : '';
        vm.recentSearches = recentSearchesService.getRecentSearches();
        vm.showConceptView = showConceptView;
        vm.runRecentSearch = runRecentSearch;
        vm.appName = brandService.getBrandValues().appName;
        vm.productName = brandService.getBrandValues().productName;

        function runRecentSearch(searchStr) {
            recentSearchesService.runSearch(searchStr);
        }

        function showConceptView() {
            if (vm.brand) {
                $state.go('conceptModal');
            } else {
                $state.go('conceptModal', {brand: vm.brand});
            }
        }

    }


})();
