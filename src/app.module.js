(function() {
    'use strict';

    angular.module('app', [
        // Common (everybody has access to these)
        'app.core',

        // Features (listed alphabetically)
        'app.approot',
        'app.dashboard',
        'app.details-overlay',
        'app.footer',
        'app.login-overlay',
        'app.search',
        'app.search-overlay',
        'app.snapshot-row',
        'app.topnav'
    ]);

})();
