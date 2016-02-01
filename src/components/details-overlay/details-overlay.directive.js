/*jshint maxcomplexity:100 */
(function () {

    'use strict';

    angular.module('app.details-overlay')
        .directive('tmplDetailsOverlay', directiveFunction)
        .controller('DetailsOverlayController', ControllerFunction);


    // ----- directiveFunction -----
    directiveFunction.$inject = [];

    /* @ngInject */
    function directiveFunction() {

        var directive = {
            restrict: 'E',
            templateUrl: 'components/details-overlay/details-overlay.html',
            scope: {
                close: '&',
                cusip: '@'
            },
            controller: 'DetailsOverlayController',
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;
    }


    // ----- ControllerFunction -----
    ControllerFunction.$inject = ['cusipService', 'logger'];

    /* @ngInject */
    function ControllerFunction(cusipService, logger) {

        var vm = this;

        vm.poolNum = '';
        vm.weightedAverageList = [];
        vm.quartileList = [];
        vm.trustDocuments = [];
        vm.offeringDocuments = [];
        vm.showDocFiles = true;
        vm.showDataFiles = false;
        vm.dataFiles = {
            csv: {
                url: '',
                name: ''
            },
            xml: {
                url: '',
                name: ''
            },
            txt: {
                url: '',
                name: ''
            }

        };

        vm.toggleDocs = toggleDocs;

        loadDetails(vm.cusip);

        function toggleDocs(docType) {
            if (docType === 'doc') {
                vm.showDocFiles = true;
                vm.showDataFiles = false;
            } else if (docType === 'data') {
                vm.showDocFiles = false;
                vm.showDataFiles = true;
            }
        }

        function loadDetails(cusip) {
            cusipService.getCusipDetails(cusip)
            .then(function(data) {
                vm.poolNum = data.security.securityPoolId;
                mapWeightedAverage(data);
                mapFiles(data);
                if (data.securityQuartiles.length > 0) {
                    mapQuartileData(data);
                } else {
                    logger.log('no quartile data returned');
                }
            });
        }

        function mapFiles(data) {
            if (data.files) {
                data.files.documents.forEach(function(file) {
                    if (file.fileType.indexOf('Trust') !== -1) {
                        file.fileName = 'Trust Document';
                        vm.trustDocuments.push(file);
                    }else {
                        if (file.fileType.indexOf('Supplement') === -1) {
                            file.fileName = 'Prospectus';
                        } else {
                            file.fileName = 'Prospectus Supplement';
                        }

                        vm.offeringDocuments.push(file);
                    }
                });

                data.files.dataFiles.forEach(function(file) {
                    if (file.fileType.indexOf('csv') !== -1) {
                        vm.dataFiles.csv.url = file.fileUrl;
                        vm.dataFiles.csv.name = file.fileName;
                    } else if (file.fileType.indexOf('xml') !== -1) {
                        vm.dataFiles.xml.url = file.fileUrl;
                        vm.dataFiles.xml.name = file.fileName;
                    } else if (file.fileType.indexOf('txt') !== -1) {
                        vm.dataFiles.txt.url = file.fileUrl;
                        vm.dataFiles.txt.name = file.fileName;
                    }
                });


            } else {
                logger.log('no documents returned');
            }
        }

        function mapQuartileData(data) {
            var nameList = [
                'MAX',
                '75%',
                'MED',
                '25%',
                'MIN'
            ];

            nameList.forEach(mapQartileByName);

            function mapQartileByName(name) {
                /* globals _ */
                var dataSet = _.findWhere(data.securityQuartiles, {quartileLevel: name});
                vm.quartileList.push(dataSet);
            }
        }

        /*jshint maxcomplexity:20 */
        function mapWeightedAverage(data) {
            vm.weightedAverageList = {
                coupon: {
                    issuance: data.issuanceWACoupon !== null ? data.issuanceWACoupon : false,
                    current: data.currentWACoupon !== null ? data.currentWACoupon : false
                },
                maturity: {
                    issuance: data.issuanceWAMaturity !== null ? data.issuanceWAMaturity : '\u2014',
                    current: data.currentWAMaturity !== null ? data.currentWAMaturity : '\u2014'
                },
                credit: {
                    issuance: data.issuanceWACreditScore !== null ? data.issuanceWACreditScore : '\u2014',
                    current: data.currentWACreditScore !== null ? data.currentWACreditScore : '\u2014'
                },
                ltv: {
                    issuance: data.issuanceWALoanToValue !== null ? data.issuanceWALoanToValue : '\u2014',
                    current: data.currentWALoanToValue !== null ? data.currentWALoanToValue : '\u2014'
                },
                age: {
                    issuance: data.issuanceWALoanAge !== null ? data.issuanceWALoanAge : '\u2014',
                    current: data.currentWALoanAge !== null ? data.currentWALoanAge : '\u2014'
                },
                term: {
                    issuance: data.issuanceWALoanTerm !== null ? data.issuanceWALoanTerm : '\u2014',
                    current: data.currentWALoanTerm !== null ? data.currentWALoanTerm : '\u2014'
                }
            };

        }

    }

})();
