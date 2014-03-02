'use strict';

angular.module('astatusApp')
  .controller('MainCtrl', function ($scope, $firebase, $timeout) {

    var serverTimeOffset = new Firebase("https://vivid-fire-1812.firebaseio.com/.info/serverTimeOffset");
    var statusList = new Firebase("https://vivid-fire-1812.firebaseio.com/").endAt().limit(400);
    var offsetDate;
    var estimatedServerTimeMs;
    var loadFinish = false;

    setTimeout(function() {loadFinish = true}, 4000);

    $scope.statusListFirebase = $firebase(statusList);
    $scope.statusList = [];
    $scope.slideText = [];

    serverTimeOffset.on("value", function(snap) {
      offsetDate = snap.val();
    });

    statusList.on("child_added", function (snap) {
      $timeout(function () {
        $scope.statusList.unshift(snap.val());
        if (loadFinish) {
          $scope.slideText.push({ text: snap.val().text });
        }
      });
    })

    $scope.textEnter = function (e) {
     if (e.keyCode == 13) {
        console.log(1111)
      } 
    };

    $scope.addValue = function () {
      if (!$scope.newStatus || $scope.newStatus == "" || !offsetDate) {
        return;
      }

      estimatedServerTimeMs = new Date().getTime() + offsetDate;

      $scope.statusListFirebase.$add({text: $scope.newStatus, createAt: new Date(estimatedServerTimeMs)});
      $scope.newStatus = "";
    }
  });
