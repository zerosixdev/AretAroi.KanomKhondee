function saleSummaryAretAroi() {
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

  // Sort the typeCounts by counts in ascending order, then alphabetically
  var sortedTypes = Object.keys(typeCounts).map(function(type) {
    return [type, typeCounts[type]];
  });

  sortedTypes.sort(function(a, b) {
    if (a[1] !== b[1]) {
      return a[1] - b[1]; // Sort by count in ascending order
    } else {
      return a[0].localeCompare(b[0]); // If counts are equal, sort alphabetically by type name
    }
  });

  // Create Flex Message
  var flexMessage = {
    "type": "flex",
    "altText": "Sales Summary",
    "contents": {
      "type": "bubble",
      "header": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "Sales Summary Aret Aroi",
            "weight": "bold",
            "size": "xl"
          },
          {
            "type": "text",
            "text": todayString,
            "size": "sm",
            "color": "#AAAAAA"
          }
        ]
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": sortedTypes.map(function(item) {
          return {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "text",
                "text": item[0],
                "size": "md",
                "flex": 5
              },
              {
                "type": "text",
                "text": "X" + item[1],
                "size": "md",
                "align": "end",
                "flex": 1
              }
            ]
          };
        })
      },
      "footer": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "ยอดรวมทั้งหมด " + totalSales + " บาท",
            "weight": "bold",
            "size": "17px",
            "align": "center"
          }
        ]
      }
    }
  };

  // Send Flex Message to LINE OA
  sendLineOAFlexMessage(flexMessage);
}

function sendLineOAFlexMessage(flexMessage) {
  var channelAccessToken = "Token Or Key";                       // Replace with your LINE OA Channel Access Token
  var url = "https://api.line.me/v2/bot/message/push";
  var userId = "Token Or Key";                                   // Replace with the user ID or group ID to send the message to

  var payload = JSON.stringify({
    "to": userId,
    "messages": [flexMessage]
  });

  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": payload,
    "headers": {
      "Authorization": "Bearer " + channelAccessToken
    }
  };

  UrlFetchApp.fetch(url, options);
}
