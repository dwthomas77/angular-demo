(function () {

    'use strict';

    angular.module('app.snapshot-row')
        .directive('tmplSnapshotRow', directiveFunction)
        .controller('SnapshotRowController', ControllerFunction);


    // ----- directiveFunction -----
    directiveFunction.$inject = ['brandService', '$rootScope', '$templateCache', '$compile'];

    /* @ngInject */
    function directiveFunction(brandService, $rootScope, $templateCache, $compile) {

        var directive = {
            restrict: 'A',
            templateUrl: 'components/snapshot-row/snapshot-row.html',
            scope: {
                security: '='
            },
            controller: 'SnapshotRowController',
            controllerAs: 'vm',
            bindToController: true,
            link: function(scope, elem) {
                // fired when brand changes
                $rootScope.$on('brandChange', function() {
                    scope.vm.downloadBtn = brandService.getBrandValues().downloadBtn;
                    elem.html($templateCache.get('components/snapshot-row/snapshot-row.html'));
                    $compile(elem.contents())(scope);
                });
            }
        };

        return directive;
    }


    // ----- ControllerFunction -----
    ControllerFunction.$inject = ['$modal', 'brandService'];

    /* @ngInject */
    function ControllerFunction($modal, brandService) {

        var vm = this;

        vm.downloadBar = 'hide';

        vm.downloadBtn = brandService.getBrandValues().downloadBtn;

        vm.openDetailsOverlay = openDetailsOverlay;

        vm.toggleDownloadBar = toggleDownloadBar;

        vm.openRedirectOverlay = openRedirectOverlay;

        function openRedirectOverlay() {
            $modal.open({
                animation: false,
                size: 'sm',
                templateUrl: 'components/snapshot-row/redirect-modal.html'
            });
        }

        function toggleDownloadBar() {
            vm.downloadBar = (vm.downloadBar === 'hide') ? 'show' : 'hide';
            if (vm.downloadBar === 'show') {
                vm.downloadBtn = 'images/Download_White.png';
            } else {
                vm.downloadBtn = brandService.getBrandValues().downloadBtn;
            }
        }

        function openDetailsOverlay(cusip) {
            $modal.open({
                animation: false,
                size: 'lg',
                template: '<tmpl-details-overlay close="$close()" cusip="' + cusip + '"></tmpl-details-overlay>'
            });
        }


    }

})();
