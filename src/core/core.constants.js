/* global _ */

(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('_', _)
        .constant('api', 'http://localhost:7203/api')
        .constant('restURI', 'http://del2lfnmemoil:8080/');
})();
