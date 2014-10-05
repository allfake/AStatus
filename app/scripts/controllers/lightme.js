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
        '#39B100',
        '#326BFF',
        '#FF2C56',
        '#FFCC00',
        '#64009C',
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

    $scope.$watch("color.selected", function (val, oldVal) {
      if (!$scope.isLoadding && val != oldVal) {
        var index = lightmeFirebase.$getIndex(0);
        lightmeFirebase[index].color = val;
        lightmeFirebase.$save();

        var subSharp = val.substring(1, val.length);
        PubNub.ngPublish({
          channel: theChannel,
          message: {"text": subSharp}
        });

      }
    });
  });