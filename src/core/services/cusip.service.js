(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('cusipService', cusipService);

    cusipService.$inject = ['$http', 'restURI', 'brandService'];

    /* @ngInject */
    function cusipService($http, restURI, brandService) {
        //var someValue = '';
        var service = {
            cusipList: [],
            getSnapshotByCusip: getSnapshotByCusip,
            getAllCusips: getAllCusips,
            getCusipDetails: getCusipDetails,
            getSnapshotsByDate: getSnapshotsByDate
        };

        return service;



        function getSnapshotByCusip(cusip) {
            return $http.get(restURI + 'disclosure-dashboard/ds/security/search?cusip=' + cusip)
                .then(function(response) {
                    service.snapshotData = response.data;
                    return service.snapshotData;
                });
        }

        function getSnapshotsByDate(dateStr) {
            return $http.get(restURI + 'disclosure-dashboard/ds/security/search?date=' + dateStr)
                .then(function(response) {
                    service.cusipList = response.data;
                    service.cusipList = filterForBrand(service.cusipList);
                    if (brandService.getBrand() === 'freddie') {
                        service.cusipList.push(generateFreddieCusip());
                    }
                    return service.cusipList;
                });
        }

        function getAllCusips() {
            return $http.get(restURI + 'disclosure-dashboard/ds/security/search')
                .then(function(response) {
                    service.cusipList = response.data;
                    service.cusipList = filterForBrand(service.cusipList);
                    if (brandService.getBrand() === 'freddie') {
                        service.cusipList.push(generateFreddieCusip());
                    }
                    return service.cusipList;
                });
        }

        function getCusipDetails(cusip) {
            return $http.get(restURI + 'disclosure-dashboard/ds/security/details?cusip=' + cusip)
                .then(function(response) {
                    service.cusipDetails = response.data;
                    return service.cusipDetails;
                });
        }

        function filterForBrand(list) {
            var filteredList = [];
            var brand = brandService.normalizeBrand(brandService.getBrand());
            list.forEach(function(item) {
                if (item.securityIssuerName === brand) {
                    filteredList.push(item);
                }
            });
            return filteredList;
        }

        function generateFreddieCusip() {

            var cusipObj = {

                disclosureStatus: null,
                issuanceWACoupon: 4,
                securityCusipId: '31292MQH9',
                securityIssuancebalance: 1436503,
                securityIssueDate: '2013-01-04',
                securityIssuerName: 'Fannie Mae',
                securityLegacyIndicator: 'N',
                securityMaturitydate: '2043-01-04',
                securityPoolId: 'AR8721',
                securityPoolPrefix: null,
                securityStatus: 'Active',
                securitySubPoolTypeCode: null,
                securityType: 'MBS',
                redirectFlag: true

            };

            return cusipObj;
        }
    }

})();