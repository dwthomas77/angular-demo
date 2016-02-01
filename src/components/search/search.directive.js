(function () {

    'use strict';

    angular.module('app.search')
        .directive('tmplSearch', directiveFunction)
        .controller('SearchController', ControllerFunction);


    // ----- directiveFunction -----
    directiveFunction.$inject = ['$state', 'brandService'];

    /* @ngInject */
    function directiveFunction($state, brandService) {

        // Branded Colors and Content
        if ($state.params.brand) {
            brandService.loadBranding($state.params.brand);
        }

        var directive = {
            restrict: 'E',
            templateUrl: 'components/search/search.html',
            scope: {
            },
            controller: 'SearchController',
            controllerAs: 'vm'
        };

        return directive;
    }


    // ----- ControllerFunction -----
    ControllerFunction.$inject = ['cusipService', '$stateParams', 'recentSearchesService'];

    /* @ngInject */
    function ControllerFunction(cusipService, $stateParams, recentSearchesService) {

        var vm = this;

        vm.searchInput = '';
        vm.searchType = '';
        vm.lastSearch = $stateParams.cusipId;
        vm.searchAll = false;

        vm.resultMsgObj = {
            count: 0,
            type: 'CUSIP',
            searchValue: ''
        };

        vm.filterData = [
            {
                name: 'Status',
                value: null
            },
            {
                name: 'Security Type',
                value: 'MBS: Single-Family'
            },
            {
                name: 'Issue Date',
                value: '10/1/2015'
            },
            {
                name: 'Maturity Date',
                value: null
            },
            {
                name: 'Pool Prefix/Class',
                value: null
            },
            {
                name: 'Original Security Balance',
                value: null
            }
        ];

        vm.snapshotList = [];

        vm.colTitles = [
            'CUSIP',
            'Status',
            'Security Type',
            'Pool/Trust Number',
            'Coupon',
            'Issue Date',
            'Maturity Date',
            'Original Balance'
        ];

        vm.runSearchQuery = runSearchQuery;

        activate();

        function activate() {

            if ($stateParams.cusipId) {
                searchByCusip($stateParams.cusipId);
                vm.searchInput = $stateParams.cusipId;
                vm.resultMsgObj.searchValue = $stateParams.cusipId;
            } else if ($stateParams.date) {
                searchByDate($stateParams.date);
                vm.searchInput = formatDateForDisplay($stateParams.date);
                vm.resultMsgObj.searchValue = formatDateForDisplay($stateParams.date);
            }else {
                runBlankSearch();
                vm.searchAll = true;
            }

        }

        function formatDateForDisplay(str) {
            var formattedString = '';
            formattedString = str.substr(0, 2);
            formattedString += '/';
            formattedString += str.substr(2, 2);
            formattedString += '/';
            formattedString += str.substr(4, 4);
            return formattedString;
        }

        function runSearchQuery(event, val) {
            if (event.keyCode === 13 && val.length === 0) {
                runBlankSearch();
            // Date Search
            } else if (event.keyCode === 13 && val.length === 10) {
                if (val.indexOf('/') !== -1 || val.indexOf('-') !== -1) {
                    searchByDate(val);
                }
            // Cusip Search
            } else if (event.keyCode === 13 && val.length === 9 && val.indexOf('-') === -1) {
                searchByCusip(val.toUpperCase());
            }
        }

        function runBlankSearch() {
            cusipService.getAllCusips()
            .then(function(data) {
                vm.resultMsgObj.count = data.length;
                vm.snapshotList = data;
                vm.searchAll = true;
                vm.searchInput = '';
            });
        }

        function searchByCusip(cusip) {
            cusipService.getSnapshotByCusip(cusip)
            .then(function(data) {
                vm.lastSearch = cusip;
                vm.resultMsgObj.count = data.length;
                vm.snapshotList = data;
                vm.resultMsgObj.type = 'CUSIP';
                vm.resultMsgObj.searchValue = vm.lastSearch;
                vm.searchAll = false;
                recentSearchesService.addSearch(cusip);
            });
        }

        function searchByDate(dateStr) {
            var reDash = /-/g;
            var reSlash = /\//g;
            dateStr = dateStr.replace(reDash, '');
            dateStr = dateStr.replace(reSlash, '');
            //dateStr = dateStr.replace('/', '');
            cusipService.getSnapshotsByDate(dateStr)
                .then(function(data) {
                    vm.resultMsgObj.count = data.length;
                    vm.snapshotList = data;
                    vm.resultMsgObj.type = 'Date';
                    vm.searchAll = false;
                    vm.lastSearch = formatDateForDisplay(dateStr);
                    vm.resultMsgObj.searchValue = vm.lastSearch;
                    recentSearchesService.addSearch(dateStr);
                });
        }
    }

})();
