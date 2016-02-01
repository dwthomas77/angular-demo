(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('brandService', brandService);

    brandService.$inject = ['$rootScope'];

    function brandService($rootScope) {

        var currentBrand = 'fannie';

        var brandMap = {
            fannie: {
                logo: 'images/FannieMae_Logo.png',
                downloadBtn: 'images/Download_Blue.png',
                appName: 'MBSX',
                productName: 'MBS'
            },
            freddie: {
                logo: 'images/FreddieMac_Logo.png',
                downloadBtn: 'images/Download_Green.png',
                appName: 'PCX',
                productName: 'PCs'
            },
            ginnie: {
                logo: 'images/GinnieMae_Logo.png',
                downloadBtn: 'images/Download_Purple.png',
                appName: 'MBSX',
                productName: 'MBS'
            }
        };

        var service = {
            currentBrand: currentBrand,
            brandValues: brandMap,
            loadBranding: loadBranding,
            getBrandValues: getBrandValues,
            getBrand: getBrand,
            normalizeBrand: normalizeBrand
        };

        return service;

        function getBrand() {
            return service.currentBrand;
        }

        function getBrandValues() {
            return service.brandValues[service.currentBrand];
        }

        function loadBranding(brand) {
            service.currentBrand = brand;
            document.documentElement.className = brand;
            $rootScope.$broadcast('brandChange', service.currentBrand);
        }

        function normalizeBrand(str) {
            if (str === 'freddie') {
                return 'Freddie Mac';
            } else if (str === 'ginnie') {
                return 'Ginnie Mae';
            } else {
                return 'Fannie Mae';
            }
        }

    }

})();

