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
    $scope.checkingStatus = true;

    if (!$rootScope.initialized) {
      // Initialize the PubNub service
      PubNub.init({
        subscribe_key: 'demo',
        publish_key: 'demo',
        ssl: true,
      });
      $rootScope.initialized = true;

    }

    PubNub.ngSubscribe({ channel: theChannel })
    PubNub.ngHereNow({
      channel: theChannel,
      state: true,
      uuid: false
    });

    $rootScope.$on(PubNub.ngPrsEv(theChannel), function(event, payload) {

      $scope.onlines = PubNub.ngPresenceData(theChannel);
      $scope.checkingStatus = false;

      $scope.isOnline = false;
      _.each($scope.onlines, function(value, key, list){
        
        if (value && value.name && value.name == 'thermal_printer') {
          $scope.isOnline = true;
        }
      
      });

    })

    serverTimeOffset.on("value", function(snap) {
      offsetDate = snap.val();
    });

    statusList.on("value", function (snap) {
      if (!loadFinish) {
        $scope.statusList = [];
        _.each(snap.val(), function (val) {
          if (val.text != undefined) {
            $scope.statusList.unshift(val);
          }
        });

        if (snap.numChildren() >= $scope.statusList.length) {
          $timeout(function () {
            loadFinish = true;
          }, 100);
        }
      }
    });

    statusList.on("child_added", function (snap) {      
      if (loadFinish && !!snap.val().text) {
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

    $scope.printText = function (text) {
      
      PubNub.ngPublish({
        channel: theChannel,
        message: {"text": "LL" + text}
      });
    }

    $scope.printImage = function (imageName) {
      
      PubNub.ngPublish({
        channel: theChannel,
        message: {"text": imageName}
      });
    }
  });
