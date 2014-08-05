'use strict';

angular.module('astatusApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngAnimate',
  'wu.masonry',
  'firebase',
  'pubnub.angular.service'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/water', {
        templateUrl: 'views/water.html',
        controller: 'WaterCtrl'
      })      
      .otherwise({
        redirectTo: '/'
      });
  });
