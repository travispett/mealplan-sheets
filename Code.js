function setCalendar() {
  Logger.log('Running task :: setCalendar :: ' + new Date().toISOString());

  var oneWeek = 7;

  var calId = 'pk4a976hlrr7r9rn1dapb6b1lk@group.calendar.google.com';
  var sheet = SpreadsheetApp.getActiveSheet();
  var configSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Config');
  var cal = CalendarApp.getCalendarById(calId);

  var dateStartRow = parseInt(configSheet.getRange(2, 1).getValue(), 10);
  var mealStartRow = parseInt(configSheet.getRange(2, 2).getValue(), 10);
  var startCol = 2;

  var dateDataRange = sheet.getRange(dateStartRow, startCol, 1, oneWeek);
  var mealDataRange = sheet.getRange(mealStartRow, startCol, 1, oneWeek);

  var dateData = dateDataRange.getValues();
  var mealData = mealDataRange.getValues();
  dateData = dateData[0] || [];
  var mealNames = mealData[0] || [];

  if (!cal || !sheet || mealNames.length !== oneWeek || dateData.length !== oneWeek) {
    Logger.log(
      'Error thrown. [mealData length: ' +
        mealNames.length +
        '] [dateData.length: ' +
        dateData.length +
        ']'
    );

    return;
  }

  dateData.forEach(function(date, index) {
    if (index >= mealNames.length || mealNames[index] === null || date === null) {
      return;
    }

    var mealName = mealNames[index] || '';
    var events = cal.getEventsForDay(date);

    // TODO: A nice meal object with create and update functions would make
    // the logic in these much easier to work with.
    if (!events.length) {
      return createMeal(cal, mealName, date);
    }

    var existingMeal = events[0];
    updateActiveMeal(existingMeal, mealName, date);
  });
}

function updateActiveMeal(existingMeal, newMealName, date) {
  var existingMealName = existingMeal.getTitle();

  if (existingMealName === newMealName || !existingMeal.isAllDayEvent()) {
    return;
  }

  Logger.log(
    'Changing meal: ' + existingMealName + ' to ' + newMealName + ' on ' + date.toGMTString()
  );

  existingMeal.setTitle(newMealName);
}

function createMeal(cal, mealTitle, mealDate) {
  Logger.log('Creating meal: ' + mealTitle + ' on ' + mealDate.toGMTString());
  cal.createAllDayEvent(mealTitle, mealDate);
}

function setCalendarTrigger() {
  Logger.log('Setting trigger :: ' + new Date().toISOString());

  // TODO: Check for existing trigger.
  ScriptApp.newTrigger('setCalendar')
    .timeBased()
    .atHour(2)
    .everyDays(1)
    .create();
}

// Create a menu in the Sheet for adding the trigger.
function onOpen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [{ name: 'Set Calendar Trigger', functionName: 'setCalendarTrigger' }];
  ss.addMenu('Calendar', menuEntries);
}
