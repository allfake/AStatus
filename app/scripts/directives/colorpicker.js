'use strict';

/**
 * @ngdoc directive
 * @name astatusApp.directive:colorPicker
 * @description
 * # colorPicker
 */
angular.module('astatusApp')
  .directive('colorPicker', function () {
    return {
        scope: {
            selected: '=',
            customizedColors: '=colors'
        },
        restrict: 'AE',
        template: '<ul><li ng-repeat="color in colors" ng-class="{selected: (color===selected)}" ng-click="pick(color)" style="background-color:{{color}};"></li></ul>',
        link: function (scope, element, attr) {
            var defaultColors =  [
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
                '#e1e1e1'
            ];
            scope.colors = scope.customizedColors || defaultColors;
            scope.selected = scope.selected || scope.colors[0];

            scope.pick = function (color) {
                scope.selected = color;
            };

        }
    };
  });
