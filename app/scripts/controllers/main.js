'use strict';

angular.module('astatusApp')
  .controller('MainCtrl', function ($scope, $firebase, $timeout, $location, $rootScope, PubNub) {

    var serverTimeOffset = new Firebase("https://radiant-fire-8395.firebaseio.com/.info/serverTimeOffset");
    var statusList = new Firebase("https://radiant-fire-8395.firebaseio.com/").endAt().limit(20);
    var offsetDate;
    var estimatedServerTimeMs;
    var loadFinish = false;
    var theChannel = 'astatus';

    $scope.radioTextSizeModel = 'L';
    $scope.radioTextAlignModel = 'L';

    $scope.statusListFirebase = $firebase(statusList);
    $scope.statusList = [];
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
        $scope.statusList = [];
        _.each(snap.val(), function (val) {
          $scope.statusList.unshift(val);
        });

        if (snap.numChildren() >= $scope.statusList.length) {
          $timeout(function () {
            loadFinish = true;
          }, 100);
        }
      }
    });

    statusList.on("child_added", function (snap) {      
      if (loadFinish) {
        $scope.statusList.unshift(snap.val());
        $scope.slideText.push({ text: snap.val().text });
      }
    })

    $scope.addValue = function () {
      if (!$scope.newStatus || $scope.newStatus == "" || !offsetDate) {
        return;
      }

      PubNub.ngPublish({
        channel: theChannel,
        message: {"text": $scope.radioTextSizeModel + $scope.radioTextAlignModel + $scope.newStatus}
      });

      estimatedServerTimeMs = new Date().getTime() + offsetDate;

      $scope.statusListFirebase.$add({text: $scope.newStatus, createAt: new Date(estimatedServerTimeMs)});
      $scope.newStatus = "";
    }

    $scope.changeView = function () {
      $scope.$apply( $location.path( 'water' ) );
    }

    $scope.printImage = function (imageName) {
      
      PubNub.ngPublish({
        channel: theChannel,
        message: {"text": imageName}
      });
    }
  });
