'use strict';

/**
 * @ngdoc function
 * @name astatusApp.controller:LightmeCtrl
 * @description
 * # LightmeCtrl
 * Controller of the astatusApp
 */
angular.module('astatusApp')
  .controller('LightmeCtrl', function ($scope, $firebase, PubNub, $rootScope) {
    
    var lightme = new Firebase("https://radiant-fire-8395.firebaseio.com/data").limit(1);
    var lightmeFirebase = $firebase(lightme);
    var theChannel = 'lightme';

    $scope.color = {};
    $scope.color.selected = "#46d6db";
    $scope.mycolor = {};
    $scope.mycolor.colors = 
    [
        '#7bd148',
        '#5484ed',
        '#a4bdfc',
        '#46d6db',
        '#7ae7bf',
        '#51b749',
        '#fbd75b',
        '#ffb878',
        '#ff887c',
        '#dc2127',
        '#dbadff',
        '#ffffff',
        '#000000'
      ];
    

    $scope.isLoadding = true;

    if (!$rootScope.initialized) {
      // Initialize the PubNub service
      PubNub.init({
        subscribe_key: 'demo',
        publish_key: 'demo',
      });
      $rootScope.initialized = true;
    }

    lightme.on("value", function (snap) {
      if (snap.val() == null) {
        $scope.isLoadding = false;
        lightmeFirebase.$add({color: "#7bd148"});
      }
      _.each(snap.val(), function (val) {
        $scope.isLoadding = false;
        $scope.color.selected = val.color;
      });
    });

    $scope.$watch("color.selected", function (val) {
      if (!$scope.isLoadding) {
        var index = lightmeFirebase.$getIndex(0);
        lightmeFirebase[index].color = val;
        lightmeFirebase.$save();

        PubNub.ngPublish({
          channel: theChannel,
          message: {"text": val}
        });

      }
    });
  });