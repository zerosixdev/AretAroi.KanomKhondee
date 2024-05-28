function countTypesAndSumSalesForToday() {
  var sheetName = "MASTER V.3"; // Replace with the name of your sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var dataRange = sheet.getDataRange();
  var data = dataRange.getValues();
  
  // Get today's date
  var today = new Date();
  var todayString = Utilities.formatDate(today, Session.getScriptTimeZone(), "yyyy-MM-dd");
  
  
  var totalSales = 0;
  var typeCounts = {};

  // Iterate over the data, starting from the second row (skip the header)
  for (var i = 1; i < data.length; i++) {
    var dateCell = data[i][1]; // Column B
    
    // Check if the cell is a valid date
    if (dateCell instanceof Date) {
      var dateString = Utilities.formatDate(dateCell, Session.getScriptTimeZone(), "yyyy-MM-dd");
      
      // Check if the date matches today's date
      if (dateString === todayString) {
        var sales = parseFloat(data[i][4]); // Column E
        if (!isNaN(sales)) {
          totalSales += sales;
        }

        var types = data[i][3]; // Column D
        if (types && types.trim() !== '') { // Check if types are non-empty
          var typeEntries = types.split('\n'); // Split by newline
          for (var j = 0; j < typeEntries.length; j++) {
            var typeEntry = typeEntries[j].trim();
            var match = typeEntry.match(/^(.+?)\s+(\d+)$/); // Match type and count
            if (match) {
              var type = match[1].trim();
              var count = parseInt(match[2], 10);
              
              if (!isNaN(count)) {
                if (!typeCounts[type]) {
                  typeCounts[type] = 0;
                }
                typeCounts[type] += count;
              }
            }
          }
        }
      }
    }
  }

  // Create a summary message
  var message = todayString + "\nTotal Sales for Aret Aroi Store\n";
  for (var type in typeCounts) {
    message += "- " + type + " X" + typeCounts[type] + "\n";
  }
  
  message += "\nยอดรวมทั้งหมด " + totalSales + " บาท" 
  Logger.log(message);
  
  // Send message to LINE Notify
  sendLineNotify(message);
}

function sendLineNotify(message) {
  var token = "{{Token Line Notify}}"; // Replace with your LINE Notify access token
  var options = {
    "method": "post",
    "payload": "message=" + encodeURIComponent(message),
    "headers": {
      "Authorization": "Bearer " + token
    }
  };

  UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options);
}
