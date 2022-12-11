function doGet(e) {
  return HtmlService.createTemplateFromFile('Index').evaluate()
      .setTitle("KANOM KHONDEE V.3")
      .addMetaTag('viewport','width=device-width , initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
}

function saveData(obj) {
  var folder = DriveApp.getFolderById("1Kq6i-xqL4ThrQvsU145akPDRtHCtMJt2");
  var file = ''
  if (obj.imagedata) {
    var datafile = Utilities.base64Decode(obj.imagedata)
    var blob = Utilities.newBlob(datafile, obj.filetype, obj.filename);
    file = folder.createFile(blob).getUrl()
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