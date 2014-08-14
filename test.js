define([
  './module'
], function (module) {
  'use strict';

  return module.service('ContactModal', ['$modalOnce', 'Enums', 'Employee', 'HowHeardType', 'EventLocation', 'Category', 'Measurements', 'CompanySetting', function ($modalOnce, Enums, Employee, HowHeardType, EventLocation, Category, Measurements, CompanySetting) {
    var service = {

      openAdd: function (employeeId, eventDate, eventTypeId, eventLocationId) {
        return $modalOnce.open({
          templateUrl: 'js/modules/contact-modal/add-quick-contact.tpl.html',
          controller: 'AddQuickContactModalCtrl',
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
                  eventDate: eventDate,
                  eventTypeId: eventTypeId,
                  eventLocationId: eventLocationId
                }
              };
            }
          }
        });
      },

      openViewMeasurements: function (contactId) {
        return $modalOnce.open({
          templateUrl: 'js/modules/contact-modal/view-contact-measurements.tpl.html',
          controller: 'ViewContactMeasurementsCtrl',
          resolve: {
            contactId: function () {
              return contactId;
            },
            measurements: ['Measurements', function (Measurements) {
              return Measurements.findByContactId(contactId);
            }]
          },
          windowClass: 'measurements-modal'
        });
      }
    };

    return service;
  }]);
});
