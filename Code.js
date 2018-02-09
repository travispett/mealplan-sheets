function setCalendar() {
  Logger.log('Running task :: setCalendar :: ' + new Date().toISOString());

  var calId = 'pk4a976hlrr7r9rn1dapb6b1lk@group.calendar.google.com';
  var sheet = SpreadsheetApp.getActiveSheet();
  var cal = CalendarApp.getCalendarById(calId);

  var dateStartRow = 16;
  var mealStartRow = 23;
  var startCol = 2;

  var dateDataRange = sheet.getRange(dateStartRow, startCol, 1, 7);
  var mealDataRange = sheet.getRange(mealStartRow, startCol, 1, 7);

  var dateData = dateDataRange.getValues();
  var mealData = mealDataRange.getValues();
  dateData = dateData[0] || [];
  mealData = mealData[0] || [];

  if (!cal || !sheet || mealData.length !== 7 || dateData.length !== 7) {
    Logger.log(
      'Error thrown. [mealData length: ' +
        mealData.length +
        '] [dateData.length: ' +
        dateData.length +
        ']'
    );

    return;
  }

  dateData.forEach(function(thisDate, idx) {
    if (idx < mealData.length && mealData[idx] !== null && thisDate !== null) {
      var thisMeal = mealData[idx] || '';
      var events = cal.getEventsForDay(thisDate);

      if (!events.length) {
        createMeal(cal, thisMeal, thisDate);
      } else {
        var activeMealEvent = events[0];
        var activeMealTitle = activeMealEvent.getTitle();

        if (activeMealEvent.isAllDayEvent() && activeMealTitle !== thisMeal) {
          Logger.log(
            'Changing meal: ' +
              activeMealTitle +
              ' to ' +
              thisMeal +
              ' on ' +
              thisDate.toGMTString()
          );
          activeMealEvent.setTitle(thisMeal);
        }
      }
    }
  });
}

function createMeal(cal, mealTitle, mealDate) {
  Logger.log('Creating meal: ' + mealTitle + ' on ' + mealDate.toGMTString());
  cal.createAllDayEvent(mealTitle, mealDate);
}

function setCalendarTrigger() {
  Logger.log('Setting trigger :: ' + new Date().toISOString());

  ScriptApp.newTrigger('setCalendar')
    .timeBased()
    .atHour(2)
    .everyDays(1)
    .create();
}

function onOpen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [{ name: 'Set Calendar Trigger', functionName: 'setCalendarTrigger' }];
  ss.addMenu('Calendar', menuEntries);
}
