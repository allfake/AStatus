'use strict';

angular.module('astatusApp')
  .controller('MainCtrl', function ($scope, $firebase) {

    var serverTimeOffset = new Firebase("https://vivid-fire-1812.firebaseio.com/.info/serverTimeOffset");
    var statusList = new Firebase("https://vivid-fire-1812.firebaseio.com/").startAt().limit(500);
    var offsetDate = new Date().getTime();
    var estimatedServerTimeMs;
    $scope.statusList = $firebase(statusList);

    serverTimeOffset.on("value", function(snap) {
      var offsetDate = snap.val();
    });

    $scope.addValue = function () {
      if (!$scope.newStatus || $scope.newStatus == "") {
        return;
      }
      estimatedServerTimeMs = new Date().getTime() + offsetDate;
      $scope.statusList.$add({text: $scope.newStatus, create_at: new Date(estimatedServerTimeMs)});
      $scope.newStatus = "";
    }
  });
