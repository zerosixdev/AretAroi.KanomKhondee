function doGet(e) {
  return HtmlService.createTemplateFromFile('Index').evaluate()
      .setFaviconUrl("https://i.postimg.cc/xjZLsnky/healthy-food.png")
      .setTitle("เอร็ด อร่อย.ย")
      .addMetaTag('viewport','width=device-width , initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
}

//let file = '';
function saveData(obj) {
  var folder = DriveApp.getFolderById("{Key Folder Google Drive}");
  var file = ''
  if (obj.imagedata) {
    var datafile = Utilities.base64Decode(obj.imagedata)
    var blob = Utilities.newBlob(datafile, obj.filetype, obj.filename);
    file = folder.createFile(blob).getUrl()
    //Logger.log(file)
  }
var bdate = obj.data4.split("-")
var thaiDate = LanguageApp.translate(Utilities.formatDate(new Date(bdate[0],parseInt(bdate[1])-1,parseInt(bdate[2])),'GMT+7','dd-MMMM-yyyy'),'en','th').split('-').map((a,i) =>{if(i != 2 || parseInt(a)>2100){return a}; a = parseInt(a)+543; return a}).join(' ')

  var rowData = [

    new Date(),     //วันเวลาที่บันทึก
    obj.data11,     //วันที่รับอาหาร
    "K. " + obj.data4 + " / " + obj.data3,    //ข้อมูลลูกค้า
    obj.data0 + "  " + obj.data2 + "\n" + obj.data5 + "  " + obj.data7 + "\n" + obj.data8 + "  " + obj.data10 + "\n" + obj.data12 + "  " + obj.data14+ "\n" + obj.data16 + "  " + obj.data18,    //รายการอาหาร
    (obj.data1*obj.data2) +  (obj.data6*obj.data7) + (obj.data9*obj.data10) + (obj.data13*obj.data14) + (obj.data17*obj.data18),      //ยอดรวม
    obj.data15,     //โน๊ต
    file    //ไฟล์แนบ
    
    
  ];
  SpreadsheetApp.getActive().getSheets()[0].appendRow(rowData);
  return true
}

/**  INCLUDE HTML PARTS, EG. JAVASCRIPT, CSS, OTHER HTML FILES */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

/**DataTable */
function getData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = ss.getSheets()[0]
  var range = sheet.getDataRange()
  var values = range.getDisplayValues()
  Logger.log(values)
  return values
}


// - ข้าวคลุกกะปิพิเศษ X1 รวม 70
// - เกี้ยวไข่ราคา X1 รวม 30
//Line Notify Update. 20May2024

function test (obj) {
  let num1 = parseInt((obj.data1*obj.data2));         //ราคาเมนูที่ 1
  let num2 = parseInt((obj.data7*obj.data6));         //ราคาเมนูที่ 2   
  let num3 = parseInt((obj.data9*obj.data10));        //ราคาเมนูที่ 3
  let num4 = parseInt((obj.data13*obj.data14));       //ราคาเมนูที่ 4
  let num5 = parseInt((obj.data17*obj.data18));       //ราคาเมนูที่ 5

//Update. 22May2024
  //Create Link shortUrl
  var shortUrl = "n/a";
  if (obj.imagedata) {
    var folder = DriveApp.getFolderById("{Key Folder Google Drive}");
    var bitlyToken = "{BitlyToken}";
    var datafile = Utilities.base64Decode(obj.imagedata)
    var blob = Utilities.newBlob(datafile, obj.filetype, obj.filename);
    var url_slip_for_line = folder.createFile(blob).getUrl()
    shortUrl = createShortUrl(url_slip_for_line, bitlyToken);
  }

  //Check note Empty ?
  if (obj.data15 === "") {
    obj.data15 = "-";
  }
  

  //ไม่มี 1 - 4 มีเฉพราะ 5 ( Mannual )
  if( obj.data0 === "" && obj.data5 === "" && obj.data8 === "" && obj.data12 === "" ) {
    sendLineNotify("\n\nK. " + obj.data4 + "\nสถานที่จัดส่ง : " + obj.data3 + "\nวันที่รับอาหาร : " + obj.data11 + "\nโน๊ต : " + obj.data15 + "\n\nรายการอาหาร\n" + 
    "- " + obj.data16 + " X" + obj.data18 + " รวม " + (obj.data17*obj.data18) + " บาท\n" +          //เมนู 5 ( Mannual )

    "\nรวม " + (num5) + " บาท\n\nSilp : " + shortUrl
    )
  }

  //มีเมนู 1 และไม่มี 5
  else if( obj.data5 === "" && obj.data8 === "" && obj.data12 === "" && obj.data16 === "") {
    sendLineNotify("\n\nK. " + obj.data4 + "\nสถานที่จัดส่ง : " + obj.data3 + "\nวันที่รับอาหาร : " + obj.data11 + "\nโน๊ต : " + obj.data15 + "\n\nรายการอาหาร\n" + 
    "- " + obj.data0 + " X" + obj.data2 + " รวม " + (obj.data1*obj.data2) + " บาท\n" +              //เมนู 1

    "\nรวม " + (num1) + " บาท\n\nSilp : " + shortUrl
    )
  }

  //มีเมนู 1 และมี 5
  else if( obj.data5 === "" && obj.data8 === "" && obj.data12 === "" ) {
    sendLineNotify("\n\nK. " + obj.data4 + "\nสถานที่จัดส่ง : " + obj.data3 + "\nวันที่รับอาหาร : " + obj.data11 + "\nโน๊ต : " + obj.data15 + "\n\nรายการอาหาร\n" + 
    "- " + obj.data0 + " X" + obj.data2 + " รวม " + (obj.data1*obj.data2) + " บาท\n" +              //เมนู 1
    "- " + obj.data16 + " X" + obj.data18 + " รวม " + (obj.data17*obj.data18) + " บาท\n" +          //เมนู 5 ( Mannual )

    "\nรวม " + (num1+num5) + " บาท\n\nSilp : " + shortUrl
    )
  }

  //มีเมนู 1, 2 และไม่มี 5
  else if( obj.data8 === "" && obj.data12 === "" && obj.data16 === "") {
    sendLineNotify("\n\nK. " + obj.data4 + "\nสถานที่จัดส่ง : " + obj.data3 + "\nวันที่รับอาหาร : " + obj.data11 + "\nโน๊ต : " + obj.data15 + "\n\nรายการอาหาร\n" + 
    "- " + obj.data0 + " X" + obj.data2 + " รวม " + (obj.data1*obj.data2) + " บาท\n" +              //เมนู 1
    "- " + obj.data5 + " X" + obj.data7 + " รวม " + (obj.data7*obj.data6) + " บาท\n" +              //เมนู 2

    "\nรวม " + (num1+num2) + " บาท\n\nSilp : " + shortUrl
    )
  }


  //มีเมนู 1, 2 และมี 5
  else if( obj.data8 === "" && obj.data12 === "" ) {
    sendLineNotify("\n\nK. " + obj.data4 + "\nสถานที่จัดส่ง : " + obj.data3 + "\nวันที่รับอาหาร : " + obj.data11 + "\nโน๊ต : " + obj.data15 + "\n\nรายการอาหาร\n" + 
    "- " + obj.data0 + " X" + obj.data2 + " รวม " + (obj.data1*obj.data2) + " บาท\n" +              //เมนู 1
    "- " + obj.data5 + " X" + obj.data7 + " รวม " + (obj.data7*obj.data6) + " บาท\n" +              //เมนู 2
    "- " + obj.data16 + " X" + obj.data18 + " รวม " + (obj.data17*obj.data18) + " บาท\n" +          //เมนู 5 ( Mannual )

    "\nรวม " + (num1+num2+num5) + " บาท\n\nSilp : " + shortUrl
    )
  }

  //มีเมนู 1, 2, 3 และไม่มี 5
  else if( obj.data12 === "" && obj.data16 === "") {
    sendLineNotify("\n\nK. " + obj.data4 + "\nสถานที่จัดส่ง : " + obj.data3 + "\nวันที่รับอาหาร : " + obj.data11 + "\nโน๊ต : " + obj.data15 + "\n\nรายการอาหาร\n" + 
    "- " + obj.data0 + " X" + obj.data2 + " รวม " + (obj.data1*obj.data2) + " บาท\n" +              //เมนู 1
    "- " + obj.data5 + " X" + obj.data7 + " รวม " + (obj.data7*obj.data6) + " บาท\n" +              //เมนู 2
    "- " + obj.data8 + " X" + obj.data10 + " รวม " + (obj.data9*obj.data10) + " บาท\n" +            //เมนู 3

    "\nรวม " + (num1+num2+num3) + " บาท\n\nSilp : " + shortUrl
    )
  }

  //มีเมนู 1, 2, 3 และมี 5
  else if( obj.data12 === "" ) {
    sendLineNotify("\n\nK. " + obj.data4 + "\nสถานที่จัดส่ง : " + obj.data3 + "\nวันที่รับอาหาร : " + obj.data11 + "\nโน๊ต : " + obj.data15 + "\n\nรายการอาหาร\n" + 
    "- " + obj.data0 + " X" + obj.data2 + " รวม " + (obj.data1*obj.data2) + " บาท\n" +              //เมนู 1
    "- " + obj.data5 + " X" + obj.data7 + " รวม " + (obj.data7*obj.data6) + " บาท\n" +              //เมนู 2
    "- " + obj.data8 + " X" + obj.data10 + " รวม " + (obj.data9*obj.data10) + " บาท\n" +            //เมนู 3
    "- " + obj.data16 + " X" + obj.data18 + " รวม " + (obj.data17*obj.data18) + " บาท\n" +          //เมนู 5 ( Mannual )

    "\nรวม " + (num1+num2+num3+num5) + " บาท\n\nSilp : " + shortUrl
    )
  }

  //มีเมนู 1, 2, 3,4 และไม่มี 5
  else if( obj.data16 === "") {
    sendLineNotify("\n\nK. " + obj.data4 + "\nสถานที่จัดส่ง : " + obj.data3 + "\nวันที่รับอาหาร : " + obj.data11 + "\nโน๊ต : " + obj.data15 + "\n\nรายการอาหาร\n" + 
    "- " + obj.data0 + " X" + obj.data2 + " รวม " + (obj.data1*obj.data2) + " บาท\n" +              //เมนู 1
    "- " + obj.data5 + " X" + obj.data7 + " รวม " + (obj.data7*obj.data6) + " บาท\n" +              //เมนู 2
    "- " + obj.data8 + " X" + obj.data10 + " รวม " + (obj.data9*obj.data10) + " บาท\n" +            //เมนู 3
    "- " + obj.data12 + " X" + obj.data14 + " รวม " + (obj.data13*obj.data14) + " บาท\n" +          //เมนู 4

    "\nรวม " + (num1+num2+num3+num4) + " บาท\n\nSilp : " + shortUrl
    )
  }

  //มีเมนู 1, 2, 3, 4 และมี 5
  else {
    sendLineNotify("\n\nK. " + obj.data4 + "\nสถานที่จัดส่ง : " + obj.data3 + "\nวันที่รับอาหาร : " + obj.data11 + "\nโน๊ต : " + obj.data15 + "\n\nรายการอาหาร\n" + 
    "- " + obj.data0 + " X" + obj.data2 + " รวม " + (obj.data1*obj.data2) + " บาท\n" +              //เมนู 1
    "- " + obj.data5 + " X" + obj.data7 + " รวม " + (obj.data7*obj.data6) + " บาท\n" +              //เมนู 2
    "- " + obj.data8 + " X" + obj.data10 + " รวม " + (obj.data9*obj.data10) + " บาท\n" +            //เมนู 3
    "- " + obj.data12 + " X" + obj.data14 + " รวม " + (obj.data13*obj.data14) + " บาท\n" +          //เมนู 4
    "- " + obj.data16 + " X" + obj.data18 + " รวม " + (obj.data17*obj.data18) + " บาท\n" +          //เมนู 5 ( Mannual )

    "\nรวม " + ( num1 + num2 + num3 + num4 + num5 ) + " บาท\n\nSilp : " + shortUrl
    )
  }
}



function sendLineNotify(message) {
  var token = "9jiqjAZZMm8ZpZkejWTJ4Ptjmbd0hNppkfs733qLqFU"; // Replace with your LINE Notify token
  var options = {
      "method": "post",
      "payload": {
          "message": message
      },
      "headers": {
        "Authorization": "Bearer " + token
      }
    };
    var response = UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options);
    Logger.log(response.getContentText());
}


// get Bitly short link
function createShortUrl(longUrl, bitlyToken) 
{
  const bitlyEndPoint = "https://api-ssl.bitly.com/v4/shorten";
  
  const options = 
  {
    "method": "POST",
    "headers": {
      "Authorization": "Bearer " + bitlyToken,
      "Content-Type": "application/json"
    },
    "payload": JSON.stringify(
      {
      "long_url": longUrl
      }),
  };

  try {
    const shortUrl = JSON.parse(UrlFetchApp.fetch(bitlyEndPoint, options));
    //Logger.log(shortUrl.link)
    return shortUrl.link;
  } catch (error) {
    Logger.log(error.name + "：" + error.message);
    return;
  };
}
