(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('recentSearchesService', recentSearchesService);

    recentSearchesService.$inject = ['$rootScope', 'brandService', '$state'];

    function recentSearchesService($rootScope, brandService, $state) {

        var defaultList = [];

        var service = {
            recentSearchList: defaultList,
            addSearch: addSearch,
            getRecentSearches: getRecentSearches,
            runSearch: runSearch
        };

        return service;

        function runSearch(searchStr) {
            var reDash = /-/g;
            var reSlash = /\//g;
            var brand = brandService.getBrand() === 'freddie' ? 'freddie' : '';

            // Date
            if (searchStr.length === 10 && searchStr.indexOf('/') !== -1) {
                searchStr = searchStr.replace(reDash, '');
                searchStr = searchStr.replace(reSlash, '');
                if (brand) {
                    $state.go('searchByDate', {date: searchStr, brand: brand});
                } else {
                    $state.go('searchByDate', {date: searchStr});
                }
            // CUSIP
            } else if (searchStr.length === 9) {
                if (brand) {
                    $state.go('search', {cusipId: searchStr, brand: brand});
                } else {
                    $state.go('search', {cusipId: searchStr});
                }
            }
        }

        function addSearch(searchStr) {
            if (searchStr.length === 8) {
                searchStr = formatForDate(searchStr);
            }
            service.recentSearchList.push(searchStr);
        }

        function formatForDate(str) {
            var formattedString = '';
            formattedString = str.substr(0, 2);
            formattedString += '/';
            formattedString += str.substr(2, 2);
            formattedString += '/';
            formattedString += str.substr(4, 4);
            return formattedString;
        }

        function getRecentSearches() {
            var maxSearches = -3;
            return service.recentSearchList.slice(maxSearches);
        }

    }

})();

