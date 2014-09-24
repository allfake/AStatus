'use strict';

angular.module('astatusApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngAnimate',
  'wu.masonry',
  'firebase',
  'pubnub.angular.service',
  'ui.bootstrap',
  'ngColorPicker'
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
      .when('/lightme', {
        templateUrl: 'views/lightme.html',
        controller: 'LightmeCtrl'
      }) 
      .otherwise({
        redirectTo: '/'
      });
  });
