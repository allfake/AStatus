'use strict';

angular.module('astatusApp')
  .directive('slideText', function ($timeout) {
    return {
      template: '<div class="slide-text {{positionClass}}" ng-style="positionTop"><p>{{aText}}</p></div>',
      restrict: 'AE',
      scope: {
        aText: "=",
      },
      link: function postLink(scope, element, attrs) {
        var footerHeight = $('.footer').height();
        var positionTop = footerHeight * Math.random() * 0.6;
        var text = $(element).find('.slide-text p');
        $timeout(function() {
          scope.positionClass = 'slide-left';
          scope.positionTop = {top: positionTop + 'px', left: -text.width() + 'px' };
        });

      }
    };
  });
