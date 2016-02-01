(function () {
    'use strict';

    var core = angular.module('app.core');

    core.config(configFunction);

    configFunction.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];

    /* @ngInject */
    function configFunction($locationProvider, $stateProvider, $urlRouterProvider) {

        $locationProvider.html5Mode(false);

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('dashboard', {
                url: '/?brand',
                template: '<tmpl-home></tmpl-home>'
            })
            .state('search', {
                url: '/cusip/:cusipId?brand',
                template: '<tmpl-search></tmpl-search>'
            })
            .state('searchByDate', {
                url: '/date/:date?brand',
                template: '<tmpl-search></tmpl-search>'
            })
            .state('conceptModal', {
                url: '/concept/',
                template: '<div class="concept-modal"><img src="images/CSS_POC_DASHBOARD_Cropped.png">'
            });


    }

})();
