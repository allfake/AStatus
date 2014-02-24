'use strict';

angular.module('astatusApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'wu.masonry',
  'firebase'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
