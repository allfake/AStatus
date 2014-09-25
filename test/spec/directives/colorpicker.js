'use strict';

describe('Directive: colorPicker', function () {

  // load the directive's module
  beforeEach(module('astatusApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<color-picker></color-picker>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the colorPicker directive');
  }));
});
