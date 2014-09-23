'use strict';

angular.module('astatusApp')
  .controller('WaterCtrl', function ($scope, $timeout, $firebase, $location, $rootScope, PubNub) {

    var serverTimeOffset = new Firebase("https://vivid-fire-1812.firebaseio.com/.info/serverTimeOffset");
    var statusList = new Firebase("https://vivid-fire-1812.firebaseio.com/").endAt().limit(400);
    var offsetDate;
    var estimatedServerTimeMs;
    var loadFinish = false;
    var theChannel = 'astatus';

    $scope.statusListFirebase = $firebase(statusList);
    $scope.slideText = [];

    if (!$rootScope.initialized) {
      // Initialize the PubNub service
      PubNub.init({
        subscribe_key: 'demo',
        publish_key: 'demo',
      });
      $rootScope.initialized = true;
    }

    serverTimeOffset.on("value", function(snap) {
      offsetDate = snap.val();
    });

    statusList.on("value", function (snap) {
      if (!loadFinish) {
        $timeout(function () {
          loadFinish = true;
        }, 100);
      }
    });

    statusList.on("child_added", function (snap) {      
      if (loadFinish) {
        $scope.slideText.push({ text: snap.val().text });
      }
    });

    $scope.addValue = function () {
      if (!$scope.newStatus || $scope.newStatus == "" || !offsetDate) {
        return;
      }

      PubNub.ngPublish({
        channel: theChannel,
        message: {"text": $scope.newStatus, "from": "astatus"}
      });

      estimatedServerTimeMs = new Date().getTime() + offsetDate;

      $scope.statusListFirebase.$add({text: $scope.newStatus, createAt: new Date(estimatedServerTimeMs)});
      $scope.newStatus = "";
    }
    
    $scope.changeView = function () {
      $scope.$apply( $location.path( '' ) );
    }

    $scope.getRandomSpan = function(){
      return Math.floor((Math.random()*5)+1);
    }
  });
