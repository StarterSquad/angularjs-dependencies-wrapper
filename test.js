define([
  './module'
], function (module) {
  'use strict';

  return module

    .config([ "$stateProvider", "Enums", "Permissions" ])

    .service('ContactModal', function ($modalOnce, Enums, Employee, HowHeardType, EventLocation, Category, Measurements, CompanySetting) {
    var service = {

      openAdd: function (employeeId, eventDate, eventTypeId, eventLocationId) {
        return $modalOnce.open({
          templateUrl: 'js/modules/contact-modal/add-quick-contact.tpl.html',
          controller: function ($scope, CONFIG, item, itemPictures) {
            $scope.item = item;
            $scope.placeholder = CONFIG.ITEM_PLACEHOLDER_SRC;
            $scope.itemPictures = _(itemPictures.result).sortBy(function (picture) {
              return picture.sequence;
            });

          },
          resolve: {
            employees: function () {
              return Employee.query({filterObject: {status: Enums.statuses.active.value}});
            },
            eventLocations: function () {
              return EventLocation.query({filterObject: {status: Enums.statuses.active.value}});
            },
            categories: function () {
              return Category.query({filterObject: {status: Enums.statuses.active.value}});
            },
            settings: function () {
              return CompanySetting.getContactSettings();
            },
            parentProvider: function () {
              return {
                properties: {
                  employeeId: employeeId,
          [ "$modalOnce", "Enums", "Employee", "HowHeardType", "EventLocation", "Category", "Measurements", "CompanySetting" ]