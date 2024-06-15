var ref_orderid = "";
var discount = 0;
function doGet(e) {
  return HtmlService.createTemplateFromFile('Index').evaluate()
      .setFaviconUrl("https://i.postimg.cc/xjZLsnky/healthy-food.png")
      .setTitle("เอร็ด อร่อย.ย")
      .addMetaTag('viewport','width=device-width , initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
}

//let file = '';
function saveData(obj) {
  discount = obj.data19;    //Discount ที่รับมาจากฟอร์ม
  if(obj.data19 == "")
  {
    discount = 0;           //ถ้า Discounts ไม่กรอกค่ามา Set Discounts = 0
  }

  ref_orderid = "TH" + generateRandomString();
  var folder = DriveApp.getFolderById("Token or Key");
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
    discount,     //ส่วนลด
    ((obj.data1*obj.data2) +  (obj.data6*obj.data7) + (obj.data9*obj.data10) + (obj.data13*obj.data14) + (obj.data17*obj.data18) - discount),      //ยอดชำระสุทธิ
    obj.data15,     //โน๊ต
    ref_orderid,    //RefOrder
    file    //ไฟล์แนบ
    
    
  ];
  SpreadsheetApp.getActive().getSheets()[0].appendRow(rowData);
  sendlineflex(obj);
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
  return values
}


function sendlineflex (obj) {
  discount = parseInt(discount);                    //ส่วนลด
  let num1 = parseInt(obj.data1*obj.data2);         //ราคาเมนูที่ 1
  let num2 = parseInt(obj.data7*obj.data6);         //ราคาเมนูที่ 2   
  let num3 = parseInt(obj.data9*obj.data10);        //ราคาเมนูที่ 3
  let num4 = parseInt(obj.data13*obj.data14);       //ราคาเมนูที่ 4
  let num5 = parseInt(obj.data17*obj.data18);       //ราคาเมนูที่ 5


  //Check note Empty ?
  if (obj.data15 === "") {
    obj.data15 = "-";
  }
  

  //ไม่มี 1 - 4 มีเฉพราะ 5 ( Mannual )
  if( obj.data0 === "" && obj.data5 === "" && obj.data8 === "" && obj.data12 === "" ) {
    var flexMessage = {
    "type": "flex",
    "altText": "Order Details",
    "contents": {
      "type": "bubble",
      "header": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "Aret Aroi Store",
            "weight": "bold",
            "size": "xl",
            "align": "center"
          },
          {
            "type": "text",
            "text": "Ref OrderID : " + ref_orderid,
            "weight": "bold",
            "size": "md",
            "align": "center"
          }
        ]
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "K. " + obj.data4,
            "size": "md",
            "wrap": true
          },
          {
            "type": "text",
            "text": "สถานที่จัดส่ง: " + obj.data3,
            "size": "md",
            "wrap": true
          },
          {
            "type": "text",
            "text": "วันที่รับอาหาร: " + obj.data11,
            "size": "md",
            "wrap": true
          },
          {
            "type": "text",
            "text": "โน๊ต: " + obj.data15,
            "size": "md",
            "wrap": true
          },
          {
            "type": "separator",
            "margin": "md"
          },
          {
            "type": "text",
            "text": "รายการอาหาร",
            "weight": "bold",
            "size": "md",
            "margin": "md"
          },
          {
            "type": "box",
            "layout": "baseline",
            "contents": [
              {
                "type": "text",
                "text": "- " + obj.data16 + " X" + obj.data18,
                "size": "md",
                "flex": 0,
                "wrap": true
              },
              {
                "type": "text",
                "text": "รวม " + num5 + " บาท",
                "size": "md",
                "align": "end"
              }
            ],
            "margin": "md"
          },
          {
            "type": "text",
            "text": "ยอดรวมทั้งหมด " + ( num5 ) + " บาท",
            "weight": "bold",
            "size": "16px",
            "margin": "xxl"
          },
          {
            "type": "text",
            "text": "ส่วนลด " + discount + " บาท",
            "weight": "bold",
            "size": "16px",
          },
          {
            "type": "text",
            "text": "ยอดชําระสุทธิ " + ( num5 - discount ) + " บาท",
            "weight": "bold",
            "size": "16px",
          }
        ]
      }
    }
  };

  sendLineOAFlexMessage(flexMessage);
  }

  //มีเมนู 1 และไม่มี 5
  else if( obj.data5 === "" && obj.data8 === "" && obj.data12 === "" && obj.data16 === "") {
    var flexMessage = {
    "type": "flex",
    "altText": "Order Details",
    "contents": {
      "type": "bubble",
      "header": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "Aret Aroi Store",
            "weight": "bold",
            "size": "xl",
            "align": "center"
          },
          {
            "type": "text",
            "text": "Ref OrderID : " + ref_orderid,
            "weight": "bold",
            "size": "md",
            "align": "center"
          }
        ]
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "K. " + obj.data4,
            "size": "md",
            "wrap": true
          },
          {
            "type": "text",
            "text": "สถานที่จัดส่ง: " + obj.data3,
            "size": "md",
            "wrap": true
          },
          {
            "type": "text",
            "text": "วันที่รับอาหาร: " + obj.data11,
            "size": "md",
            "wrap": true
          },
          {
            "type": "text",
            "text": "โน๊ต: " + obj.data15,
            "size": "md",
            "wrap": true
          },
          {
            "type": "separator",
            "margin": "md"
          },
          {
            "type": "text",
            "text": "รายการอาหาร",
            "weight": "bold",
            "size": "md",
            "margin": "md"
          },
          {
            "type": "box",
            "layout": "baseline",
            "contents": [
              {
                "type": "text",
                "text": "- " + obj.data0 + " X" + obj.data2,
                "size": "md",
                "flex": 0,
                "wrap": true
              },
              {
                "type": "text",
                "text": "รวม " + num1 + " บาท",
                "size": "md",
                "align": "end"
              }
            ],
            "margin": "md"
          },
          {
            "type": "text",
            "text": "ยอดรวมทั้งหมด " + num1 + " บาท",
            "weight": "bold",
            "size": "16px",
            "margin": "xxl"
          },
          {
            "type": "text",
            "text": "ส่วนลด " + discount + " บาท",
            "weight": "bold",
            "size": "16px",
          },
          {
            "type": "text",
            "text": "ยอดชําระสุทธิ " + ( num1 - discount ) + " บาท",
            "weight": "bold",
            "size": "16px",
          }
        ]
      }
    }
  };

  sendLineOAFlexMessage(flexMessage);
  }

  //มีเมนู 1 และมี 5
  else if( obj.data5 === "" && obj.data8 === "" && obj.data12 === "" ) {
    var flexMessage = {
    "type": "flex",
    "altText": "Order Details",
    "contents": {
      "type": "bubble",
      "header": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "Aret Aroi Store",
            "weight": "bold",
            "size": "xl",
            "align": "center"
          },
          {
            "type": "text",
            "text": "Ref OrderID : " + ref_orderid,
            "weight": "bold",
            "size": "md",
            "align": "center"
          }
        ]
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "K. " + obj.data4,
            "size": "md",
            "wrap": true
          },
          {
            "type": "text",
            "text": "สถานที่จัดส่ง: " + obj.data3,
            "size": "md",
            "wrap": true
          },
          {
            "type": "text",
            "text": "วันที่รับอาหาร: " + obj.data11,
            "size": "md",
            "wrap": true
          },
          {
            "type": "text",
            "text": "โน๊ต: " + obj.data15,
            "size": "md",
            "wrap": true
          },
          {
            "type": "separator",
            "margin": "md"
          },
          {
            "type": "text",
            "text": "รายการอาหาร",
            "weight": "bold",
            "size": "md",
            "margin": "md"
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": "- " + obj.data0 + " X" + obj.data2,
                    "size": "md",
                    "flex": 0,
                    "wrap": true
                  },
                  {
                    "type": "text",
                    "text": "รวม " + num1 + " บาท",
                    "size": "md",
                    "align": "end"
                  }
                ],
                "margin": "md"
              },
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": "- " + obj.data16 + " X" + obj.data18,
                    "size": "md",
                    "flex": 0,
                    "wrap": true
                  },
                  {
                    "type": "text",
                    "text": "รวม " + num5 + " บาท",
                    "size": "md",
                    "align": "end"
                  }
                ],
                "margin": "md"
              }
            ]
          },
          {
            "type": "text",
            "text": "ยอดรวมทั้งหมด " + ( num1 + num5 ) + " บาท",
            "weight": "bold",
            "size": "16px",
            "margin": "xxl"
          },
          {
            "type": "text",
            "text": "ส่วนลด " + discount + " บาท",
            "weight": "bold",
            "size": "16px",
          },
          {
            "type": "text",
            "text": "ยอดชําระสุทธิ " + (( num1 + num5 ) - discount ) + " บาท",
            "weight": "bold",
            "size": "16px",
          }
        ]
      }
    }
  };

  sendLineOAFlexMessage(flexMessage);
  }

  //มีเมนู 1, 2 และไม่มี 5
  else if( obj.data8 === "" && obj.data12 === "" && obj.data16 === "") {
    var flexMessage = {
    "type": "flex",
    "altText": "Order Details",
    "contents": {
      "type": "bubble",
      "header": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "Aret Aroi Store",
            "weight": "bold",
            "size": "xl",
            "align": "center"
          },
          {
            "type": "text",
            "text": "Ref OrderID : " + ref_orderid,
            "weight": "bold",
            "size": "md",
            "align": "center"
          }
        ]
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "K. " + obj.data4,
            "size": "md",
            "wrap": true
          },
          {
            "type": "text",
            "text": "สถานที่จัดส่ง: " + obj.data3,
            "size": "md",
            "wrap": true
          },
          {
            "type": "text",
            "text": "วันที่รับอาหาร: " + obj.data11,
            "size": "md",
            "wrap": true
          },
          {
            "type": "text",
            "text": "โน๊ต: " + obj.data15,
            "size": "md",
            "wrap": true
          },
          {
            "type": "separator",
            "margin": "md"
          },
          {
            "type": "text",
            "text": "รายการอาหาร",
            "weight": "bold",
            "size": "md",
            "margin": "md"
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": "- " + obj.data0 + " X" + obj.data2,
                    "size": "md",
                    "flex": 0,
                    "wrap": true
                  },
                  {
                    "type": "text",
                    "text": "รวม " + num1 + " บาท",
                    "size": "md",
                    "align": "end"
                  }
                ],
                "margin": "md"
              },
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": "- " + obj.data5 + " X" + obj.data7,
                    "size": "md",
                    "flex": 0,
                    "wrap": true
                  },
                  {
                    "type": "text",
                    "text": "รวม " + num2 + " บาท",
                    "size": "md",
                    "align": "end"
                  }
                ],
                "margin": "md"
              }
            ]
          },
          {
            "type": "text",
            "text": "ยอดรวมทั้งหมด " + ( num1 + num2 ) + " บาท",
            "weight": "bold",
            "size": "16px",
            "margin": "xxl"
          },
          {
            "type": "text",
            "text": "ส่วนลด " + discount + " บาท",
            "weight": "bold",
            "size": "16px",
          },
          {
            "type": "text",
            "text": "ยอดชําระสุทธิ " + (( num1 + num2 ) - discount ) + " บาท",
            "weight": "bold",
            "size": "16px",
          }
        ]
      }
    }
  };

  sendLineOAFlexMessage(flexMessage);
  }

  //มีเมนู 1, 2 และมี 5
  else if( obj.data8 === "" && obj.data12 === "" ) {
    var flexMessage = {
    "type": "flex",
    "altText": "Order Details",
    "contents": {
      "type": "bubble",
      "header": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "Aret Aroi Store",
            "weight": "bold",
            "size": "xl",
            "align": "center"
          },
          {
            "type": "text",
            "text": "Ref OrderID : " + ref_orderid,
            "weight": "bold",
            "size": "md",
            "align": "center"
          }
        ]
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "K. " + obj.data4,
            "size": "md",
            "wrap": true
          },
          {
            "type": "text",
            "text": "สถานที่จัดส่ง: " + obj.data3,
            "size": "md",
            "wrap": true
          },
          {
            "type": "text",
            "text": "วันที่รับอาหาร: " + obj.data11,
            "size": "md",
            "wrap": true
          },
          {
            "type": "text",
            "text": "โน๊ต: " + obj.data15,
            "size": "md",
            "wrap": true
          },
          {
            "type": "separator",
            "margin": "md"
          },
          {
            "type": "text",
            "text": "รายการอาหาร",
            "weight": "bold",
            "size": "md",
            "margin": "md"
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": "- " + obj.data0 + " X" + obj.data2,
                    "size": "md",
                    "flex": 0,
                    "wrap": true
                  },
                  {
                    "type": "text",
                    "text": "รวม " + num1 + " บาท",
                    "size": "md",
                    "align": "end"
                  }
                ],
                "margin": "md"
              },
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": "- " + obj.data5 + " X" + obj.data7,
                    "size": "md",
                    "flex": 0,
                    "wrap": true
                  },
                  {
                    "type": "text",
                    "text": "รวม " + num2 + " บาท",
                    "size": "md",
                    "align": "end"
                  }
                ],
                "margin": "md"
              },
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": "- " + obj.data16 + " X" + obj.data18,
                    "size": "md",
                    "flex": 0,
                    "wrap": true
                  },
                  {
                    "type": "text",
                    "text": "รวม " + num5 + " บาท",
                    "size": "md",
                    "align": "end"
                  }
                ],
                "margin": "md"
              }
            ]
          },
          {
            "type": "text",
            "text": "ยอดรวมทั้งหมด " + ( num1 + num2 + num5 ) + " บาท",
            "weight": "bold",
            "size": "16px",
            "margin": "xxl"
          },
          {
            "type": "text",
            "text": "ส่วนลด " + discount + " บาท",
            "weight": "bold",
            "size": "16px",
          },
          {
            "type": "text",
            "text": "ยอดชําระสุทธิ " + (( num1 + num2 + num5 ) - discount ) + " บาท",
            "weight": "bold",
            "size": "16px",
          }
        ]
      }
    }
  };

  sendLineOAFlexMessage(flexMessage);
  }

  //มีเมนู 1, 2, 3 และไม่มี 5
  else if( obj.data12 === "" && obj.data16 === "") {
    var flexMessage = {
    "type": "flex",
    "altText": "Order Details",
    "contents": {
      "type": "bubble",
      "header": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "Aret Aroi Store",
            "weight": "bold",
            "size": "xl",
            "align": "center"
          },
          {
            "type": "text",
            "text": "Ref OrderID : " + ref_orderid,
            "weight": "bold",
            "size": "md",
            "align": "center"
          }
        ]
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "K. " + obj.data4,
            "size": "md",
            "wrap": true
          },
          {
            "type": "text",
            "text": "สถานที่จัดส่ง: " + obj.data3,
            "size": "md",
            "wrap": true
          },
          {
            "type": "text",
            "text": "วันที่รับอาหาร: " + obj.data11,
            "size": "md",
            "wrap": true
          },
          {
            "type": "text",
            "text": "โน๊ต: " + obj.data15,
            "size": "md",
            "wrap": true
          },
          {
            "type": "separator",
            "margin": "md"
          },
          {
            "type": "text",
            "text": "รายการอาหาร",
            "weight": "bold",
            "size": "md",
            "margin": "md"
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": "- " + obj.data0 + " X" + obj.data2,
                    "size": "md",
                    "flex": 0,
                    "wrap": true
                  },
                  {
                    "type": "text",
                    "text": "รวม " + num1 + " บาท",
                    "size": "md",
                    "align": "end"
                  }
                ],
                "margin": "md"
              },
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": "- " + obj.data5 + " X" + obj.data7,
                    "size": "md",
                    "flex": 0,
                    "wrap": true
                  },
                  {
                    "type": "text",
                    "text": "รวม " + num2 + " บาท",
                    "size": "md",
                    "align": "end"
                  }
                ],
                "margin": "md"
              },
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": "- " + obj.data8 + " X" + obj.data10,
                    "size": "md",
                    "flex": 0,
                    "wrap": true
                  },
                  {
                    "type": "text",
                    "text": "รวม " + num3 + " บาท",
                    "size": "md",
                    "align": "end"
                  }
                ],
                "margin": "md"
              }
            ]
          },
          {
            "type": "text",
            "text": "ยอดรวมทั้งหมด " + ( num1 + num2 + num3 ) + " บาท",
            "weight": "bold",
            "size": "16px",
            "margin": "xxl"
          },
          {
            "type": "text",
            "text": "ส่วนลด " + discount + " บาท",
            "weight": "bold",
            "size": "16px",
          },
          {
            "type": "text",
            "text": "ยอดชําระสุทธิ " + (( num1 + num2 + num3 ) - discount ) + " บาท",
            "weight": "bold",
            "size": "16px",
          }
        ]
      }
    }
  };

  sendLineOAFlexMessage(flexMessage);
  }

  //มีเมนู 1, 2, 3 และมี 5
  else if( obj.data12 === "" ) {
    var flexMessage = {
    "type": "flex",
    "altText": "Order Details",
    "contents": {
      "type": "bubble",
      "header": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "Aret Aroi Store",
            "weight": "bold",
            "size": "xl",
            "align": "center"
          },
          {
            "type": "text",
            "text": "Ref OrderID : " + ref_orderid,
            "weight": "bold",
            "size": "md",
            "align": "center"
          }
        ]
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "K. " + obj.data4,
            "size": "md",
            "wrap": true
          },
          {
            "type": "text",
            "text": "สถานที่จัดส่ง: " + obj.data3,
            "size": "md",
            "wrap": true
          },
          {
            "type": "text",
            "text": "วันที่รับอาหาร: " + obj.data11,
            "size": "md",
            "wrap": true
          },
          {
            "type": "text",
            "text": "โน๊ต: " + obj.data15,
            "size": "md",
            "wrap": true
          },
          {
            "type": "separator",
            "margin": "md"
          },
          {
            "type": "text",
            "text": "รายการอาหาร",
            "weight": "bold",
            "size": "md",
            "margin": "md"
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": "- " + obj.data0 + " X" + obj.data2,
                    "size": "md",
                    "flex": 0,
                    "wrap": true
                  },
                  {
                    "type": "text",
                    "text": "รวม " + num1 + " บาท",
                    "size": "md",
                    "align": "end"
                  }
                ],
                "margin": "md"
              },
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": "- " + obj.data5 + " X" + obj.data7,
                    "size": "md",
                    "flex": 0,
                    "wrap": true
                  },
                  {
                    "type": "text",
                    "text": "รวม " + num2 + " บาท",
                    "size": "md",
                    "align": "end"
                  }
                ],
                "margin": "md"
              },
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": "- " + obj.data8 + " X" + obj.data10,
                    "size": "md",
                    "flex": 0,
                    "wrap": true
                  },
                  {
                    "type": "text",
                    "text": "รวม " + num3 + " บาท",
                    "size": "md",
                    "align": "end"
                  }
                ],
                "margin": "md"
              },
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": "- " + obj.data16 + " X" + obj.data18,
                    "size": "md",
                    "flex": 0,
                    "wrap": true
                  },
                  {
                    "type": "text",
                    "text": "รวม " + num5 + " บาท",
                    "size": "md",
                    "align": "end"
                  }
                ],
                "margin": "md"
              }
            ]
          },
          {
            "type": "text",
            "text": "ยอดรวมทั้งหมด " + ( num1 + num2 + num3 + num5 ) + " บาท",
            "weight": "bold",
            "size": "16px",
            "margin": "xxl"
          },
          {
            "type": "text",
            "text": "ส่วนลด " + discount + " บาท",
            "weight": "bold",
            "size": "16px",
          },
          {
            "type": "text",
            "text": "ยอดชําระสุทธิ " + (( num1 + num2 + num3 + num5 ) - discount ) + " บาท",
            "weight": "bold",
            "size": "16px",
          }
        ]
      }
    }
  };

  sendLineOAFlexMessage(flexMessage);
  }

  //มีเมนู 1, 2, 3,4 และไม่มี 5
  else if( obj.data16 === "") {
    var flexMessage = {
    "type": "flex",
    "altText": "Order Details",
    "contents": {
      "type": "bubble",
      "header": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "Aret Aroi Store",
            "weight": "bold",
            "size": "xl",
            "align": "center"
          },
          {
            "type": "text",
            "text": "Ref OrderID : " + ref_orderid,
            "weight": "bold",
            "size": "md",
            "align": "center"
          }
        ]
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "K. " + obj.data4,
            "size": "md",
            "wrap": true
          },
          {
            "type": "text",
            "text": "สถานที่จัดส่ง: " + obj.data3,
            "size": "md",
            "wrap": true
          },
          {
            "type": "text",
            "text": "วันที่รับอาหาร: " + obj.data11,
            "size": "md",
            "wrap": true
          },
          {
            "type": "text",
            "text": "โน๊ต: " + obj.data15,
            "size": "md",
            "wrap": true
          },
          {
            "type": "separator",
            "margin": "md"
          },
          {
            "type": "text",
            "text": "รายการอาหาร",
            "weight": "bold",
            "size": "md",
            "margin": "md"
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": "- " + obj.data0 + " X" + obj.data2,
                    "size": "md",
                    "flex": 0,
                    "wrap": true
                  },
                  {
                    "type": "text",
                    "text": "รวม " + num1 + " บาท",
                    "size": "md",
                    "align": "end"
                  }
                ],
                "margin": "md"
              },
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": "- " + obj.data5 + " X" + obj.data7,
                    "size": "md",
                    "flex": 0,
                    "wrap": true
                  },
                  {
                    "type": "text",
                    "text": "รวม " + num2 + " บาท",
                    "size": "md",
                    "align": "end"
                  }
                ],
                "margin": "md"
              },
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": "- " + obj.data8 + " X" + obj.data10,
                    "size": "md",
                    "flex": 0,
                    "wrap": true
                  },
                  {
                    "type": "text",
                    "text": "รวม " + num3 + " บาท",
                    "size": "md",
                    "align": "end"
                  }
                ],
                "margin": "md"
              },
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": "- " + obj.data12 + " X" + obj.data14,
                    "size": "md",
                    "flex": 0,
                    "wrap": true
                  },
                  {
                    "type": "text",
                    "text": "รวม " + num4 + " บาท",
                    "size": "md",
                    "align": "end"
                  }
                ],
                "margin": "md"
              }
            ]
          },
          {
            "type": "text",
            "text": "ยอดรวมทั้งหมด " + ( num1 + num2 + num3 + num4 ) + " บาท",
            "weight": "bold",
            "size": "16px",
            "margin": "xxl"
          },
          {
            "type": "text",
            "text": "ส่วนลด " + discount + " บาท",
            "weight": "bold",
            "size": "16px",
          },
          {
            "type": "text",
            "text": "ยอดชําระสุทธิ " + (( num1 + num2 + num3 + num4 ) - discount ) + " บาท",
            "weight": "bold",
            "size": "16px",
          }
        ]
      }
    }
  };

  sendLineOAFlexMessage(flexMessage);
  }

  //มีเมนู 1, 2, 3, 4 และมี 5
  else {
    var flexMessage = {
    "type": "flex",
    "altText": "Order Details",
    "contents": {
      "type": "bubble",
      "header": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "Aret Aroi Store",
            "weight": "bold",
            "size": "xl",
            "align": "center"
          },
          {
            "type": "text",
            "text": "Ref OrderID : " + ref_orderid,
            "weight": "bold",
            "size": "md",
            "align": "center"
          }
        ]
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "K. " + obj.data4,
            "size": "md",
            "wrap": true
          },
          {
            "type": "text",
            "text": "สถานที่จัดส่ง: " + obj.data3,
            "size": "md",
            "wrap": true
          },
          {
            "type": "text",
            "text": "วันที่รับอาหาร: " + obj.data11,
            "size": "md",
            "wrap": true
          },
          {
            "type": "text",
            "text": "โน๊ต: " + obj.data15,
            "size": "md",
            "wrap": true
          },
          {
            "type": "separator",
            "margin": "md"
          },
          {
            "type": "text",
            "text": "รายการอาหาร",
            "weight": "bold",
            "size": "md",
            "margin": "md"
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": "- " + obj.data0 + " X" + obj.data2,
                    "size": "md",
                    "flex": 0,
                    "wrap": true
                  },
                  {
                    "type": "text",
                    "text": "รวม " + num1 + " บาท",
                    "size": "md",
                    "align": "end"
                  }
                ],
                "margin": "md"
              },
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": "- " + obj.data5 + " X" + obj.data7,
                    "size": "md",
                    "flex": 0,
                    "wrap": true
                  },
                  {
                    "type": "text",
                    "text": "รวม " + num2 + " บาท",
                    "size": "md",
                    "align": "end"
                  }
                ],
                "margin": "md"
              },
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": "- " + obj.data8 + " X" + obj.data10,
                    "size": "md",
                    "flex": 0,
                    "wrap": true
                  },
                  {
                    "type": "text",
                    "text": "รวม " + num3 + " บาท",
                    "size": "md",
                    "align": "end"
                  }
                ],
                "margin": "md"
              },
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": "- " + obj.data12 + " X" + obj.data14,
                    "size": "md",
                    "flex": 0,
                    "wrap": true
                  },
                  {
                    "type": "text",
                    "text": "รวม " + num4 + " บาท",
                    "size": "md",
                    "align": "end"
                  }
                ],
                "margin": "md"
              },
              {
                "type": "box",
                "layout": "baseline",
                "contents": [
                  {
                    "type": "text",
                    "text": "- " + obj.data16 + " X" + obj.data18,
                    "size": "md",
                    "flex": 0,
                    "wrap": true
                  },
                  {
                    "type": "text",
                    "text": "รวม " + num5 + " บาท",
                    "size": "md",
                    "align": "end"
                  }
                ],
                "margin": "md"
              }
            ]
          },
          {
            "type": "text",
            "text": "ยอดรวมทั้งหมด " + ( num1 + num2 + num3 + num4 + num5 ) + " บาท",
            "weight": "bold",
            "size": "16px",
            "margin": "xxl"
          },
          {
            "type": "text",
            "text": "ส่วนลด " + discount + " บาท",
            "weight": "bold",
            "size": "16px",
          },
          {
            "type": "text",
            "text": "ยอดชําระสุทธิ " + (( num1 + num2 + num3 + num4 + num5 ) - discount ) + " บาท",
            "weight": "bold",
            "size": "16px",
          }
        ]
      }
    }
  };

  sendLineOAFlexMessage(flexMessage);
  }
}


function sendLineOAFlexMessage(flexMessage) {
  var channelAccessToken = "Token or Key";  // Replace with your LINE OA Channel Access Token
  var url = "https://api.line.me/v2/bot/message/push";
  var userId = "Token or Key"; // Replace with the user ID or group ID to send the message to

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


function generateRandomString() {
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var result = '';
  for (var i = 0; i < 8; i++) {
    var randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}
