function sumSalesForToday() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var dataRange = sheet.getDataRange();
  var data = dataRange.getValues();
  
  // Get today's date
  var today = new Date();
  var todayString = Utilities.formatDate(today, Session.getScriptTimeZone(), "yyyy-MM-dd");

  var totalSales = 0;
  
  // Iterate over the data, starting from the second row (skip the header)
  for (var i = 1; i < data.length; i++) {
    var date = new Date(data[i][1]); // Column B
    
    // Format the date from the sheet to match today's date format
    var dateString = Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd");
    
    // Check if the date matches today's date
    if (dateString === todayString) {
      var sales = data[i][4]; // Column E
      totalSales += sales;
    }
  }

  // Date. 2024-05-26
  // Total Sales for Aret Aroi Store
  
  // 400 Baht.

  var message = todayString + "\nTotal Sales for Aret Aroi Store\n\n" + totalSales + " Baht.";
  Logger.log(message);
  //SpreadsheetApp.getUi().alert(message);
  

  // Send message to LINE Notify
  sendLineNotify(message);
}


function sendLineNotify(message) {
  var token = "{{Token Line Notify}}"; // Replace with your LINE Notify access token
  var options = {
    "method": "post",
    "payload": "message=" + message,
    "headers": {
      "Authorization": "Bearer " + token
    }
  };

  UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options);
}
