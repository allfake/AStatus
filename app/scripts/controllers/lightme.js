'use strict';

/**
 * @ngdoc function
 * @name astatusApp.controller:LightmeCtrl
 * @description
 * # LightmeCtrl
 * Controller of the astatusApp
 */
angular.module('astatusApp')
  .controller('LightmeCtrl', function ($scope, $firebase) {
    
    var lightme = new Firebase("https://radiant-fire-8395.firebaseio.com/data").limit(1);
    var lightmeFirebase = $firebase(lightme);
    $scope.isLoadding = true;

    lightme.on("value", function (snap) {
      if (snap.val() == null) {
        $scope.isLoadding = false;
        lightmeFirebase.$add({color: "#7bd148"});
      }
      _.each(snap.val(), function (val) {
        $scope.isLoadding = false;
        $scope.selected = val.color;
      });
    });

    $scope.$watch("selected", function (val) {
      if (!$scope.isLoadding) {
        var index = lightmeFirebase.$getIndex(0);
        // lightmeFirebase.$child(index).$update(index, {color: val});
        lightmeFirebase[index].color = val;
        lightmeFirebase.$save();
        // lightmeFirebase.$child('data').set({color: val});
      }
    });



  });