(function () {

    'use strict';

    angular.module('app.search-overlay')
        .directive('tmplSearchOverlay', directiveFunction)
        .controller('SearchOverlayController', ControllerFunction);


    // ----- directiveFunction -----
    directiveFunction.$inject = [];

    /* @ngInject */
    function directiveFunction() {

        var directive = {
            restrict: 'E',
            templateUrl: 'components/search-overlay/search-overlay.html',
            scope: {
                close: '&'
            },
            controller: 'SearchOverlayController',
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;
    }


    // ----- ControllerFunction -----
    ControllerFunction.$inject = ['$state', 'cusipService', 'recentSearchesService', 'brandService'];

    /* @ngInject */
    function ControllerFunction($state, cusipService, recentSearchesService, brandService) {
        var vm = this;

        vm.basicSearchInput = '';
        vm.basicSearchState = 'hidden';
        vm.searchType = '';
        vm.brand = brandService.getBrand() ? brandService.getBrand() : '';

        vm.recentSearches = recentSearchesService.getRecentSearches();

        vm.basicSearchQuery = basicSearchQuery;
        vm.showSearchResults = showSearchResults;
        vm.advSearchBtn = advSearchBtn;
        vm.runRecentSearch = runRecentSearch;

        vm.basicSearchChange = function(val) {
            if (val.length >= 3) {
                //determine if this is a cusip search or date search
                if (val.indexOf('/') !== -1 || val.indexOf('-') !== -1) {
                    vm.searchType = 'date';
                }else {
                    if (vm.searchType !== 'cusip') {
                        vm.searchType = 'cusip';
                    }
                }
            }
        };

        vm.secTypeIcon = 'glyphicon glyphicon-plus-sign';

        vm.secTypeToggleBool = true;

        vm.secTypeToggle = function() {
            vm.secTypeToggleBool = !vm.secTypeToggleBool;
            vm.secTypeIcon = vm.secTypeToggleBool ? 'glyphicon glyphicon-plus-sign' : 'glyphicon glyphicon-minus-sign';
        };

        getAllCusips();

        function advSearchBtn() {
            $state.go('search');
            vm.close();
        }

        function runRecentSearch(searchStr) {
            recentSearchesService.runSearch(searchStr);
            vm.close();
        }

        function searchByDate(dateStr) {
            var reDash = /-/g;
            var reSlash = /\//g;
            dateStr = dateStr.replace(reDash, '');
            dateStr = dateStr.replace(reSlash, '');
            if (vm.brand) {
                $state.go('searchByDate', {date: dateStr, brand: vm.brand});
            } else {
                $state.go('searchByDate', {date: dateStr});
            }
        }

        function basicSearchQuery(event, val) {
            // Blank Search
            if (event.keyCode === 13 && val.length === 0) {
                if (vm.brand) {
                    $state.go('search', {brand: vm.brand});
                } else {
                    $state.go('search');
                }

                vm.close();
            // Date Search
            } else if (event.keyCode === 13 && val.length === 10) {
                if (val.indexOf('/') !== -1 || val.indexOf('-') !== -1) {
                    searchByDate(val);
                    vm.close();
                }
            // Cusip Search
            } else if (event.keyCode === 13 && val.length === 9 && val.indexOf('-') === -1 ) {
                if (vm.brand) {
                    $state.go('search', {cusipId: val.toUpperCase(), brand: vm.brand});
                } else {
                    $state.go('search', {cusipId: val.toUpperCase()});
                }
                vm.close();
            }
        }

        function showSearchResults() {
            if (vm.basicSearchInput.length >= 3 && vm.basicSearchInput.indexOf('/') === -1) {
                vm.basicSearchState = 'show';
            } else {
                vm.basicSearchState = 'hidden';
            }
        }

        function getAllCusips() {
            cusipService.getAllCusips()
                .then(function(cusipList) {
                    if (cusipList && cusipList.length > 0) {
                        vm.cusipList = cusipList;
                    }
                });
        }

    }

})();
