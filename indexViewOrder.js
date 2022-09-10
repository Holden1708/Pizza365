"use strict";
    /*** REGION 1 - Global variables - Vùng khai báo biến, hằng số, tham số TOÀN CỤC */
        var gId = 0;
        var gOrderId = 0;

        const gREQUEST_STATUS_OK = 200;
        const gREQUEST_CREATE_OK = 201; // status 201 là tạo mới thành công
        const gREQUEST_READY_STATUS_FINISH_AND_OK = 4;

    /*** REGION 2 - Vùng gán / thực thi sự kiện cho các elements */
    

    /*** REGION 3 - Event handlers - Vùng khai báo các hàm xử lý sự kiện */
    function onPageLoading(){
        "use strict";

        // lấy dữ liệu điền vào select drink
        loadDataDrinkList();
        // b1: thu thập dữ liệu
        // get data from query string
        var vUrlString = window.location.href; //đường đẫn gọi đến trang
        console.log(vUrlString);
        var vUrl = new URL(vUrlString);
        // get parameter
        gId = vUrl.searchParams.get("id");
        gOrderId = vUrl.searchParams.get("orderId");
        // b2: validate
        if (gOrderId == null){
            alert("Chưa truyền orderId và Id!");
            window.location.href = "pizza365index.html";
        }
        else { 
            console.log("orderId lấy được: " + gOrderId);
            console.log("Id lấy được: " + gId);
            // b3: gọi api để lấy dữ liệu order
            var vXmlHttpOrder = new XMLHttpRequest;
            callApiOrderById(gOrderId, vXmlHttpOrder);
            // b4: hiển thị dữ liệu sinh viên trên form
            vXmlHttpOrder.onreadystatechange = function () {
                if (this.readyState == gREQUEST_READY_STATUS_FINISH_AND_OK && this.status == gREQUEST_STATUS_OK) {
                    console.log(vXmlHttpOrder.responseText); // ghi response text ra console.log
                    showOrderDetailToForm(vXmlHttpOrder);
                }
            };
        }
    }

    /*** REGION 4 - Common funtions - Vùng khai báo hàm dùng chung trong toàn bộ chương trình*/
     // Hàm thực hiện call api để load dữ liệu vào drink list
    function loadDataDrinkList() {
      var vXhttp = new XMLHttpRequest();
      vXhttp.open("GET", "http://42.115.221.44:8080/devcamp-pizza365/drinks", true);
      vXhttp.send();
      vXhttp.onreadystatechange = function () {
          if (this.readyState == gREQUEST_READY_STATUS_FINISH_AND_OK && this.status == gREQUEST_STATUS_OK) {
            handleLoadDataToSelectDrink(vXhttp);
          }
        };
    }

    // handle data load to select drink
    function handleLoadDataToSelectDrink(paramXmlHttp) {
      var vArrayDrinkList = JSON.parse(paramXmlHttp.responseText);
      //load data to drink select
      var vElementSelectDrink = document.getElementById("select-drink");
      for (var bIterator = 0; bIterator < vArrayDrinkList.length; bIterator++) {
        var vDrinkOptionElement = document.createElement("option");
        vDrinkOptionElement.value = vArrayDrinkList[bIterator].maNuocUong;
        vDrinkOptionElement.text = vArrayDrinkList[bIterator].tenNuocUong;
        vElementSelectDrink.appendChild(vDrinkOptionElement);
      }
    }

    // hàm call api để lấy dữ liệu dựa vào orderId
    function callApiOrderById(paramOrderId, paramXmlHttpOrder){
        "use strict";
        //base url
        const baseUrl = "http://42.115.221.44:8080/devcamp-pizza365/orders";
        paramXmlHttpOrder.open("GET", baseUrl + "/" + paramOrderId, true);
        paramXmlHttpOrder.send();
    }

    // hàm hiển thị dữ liệu lấy được từ orderid lên form
    function showOrderDetailToForm(paramXmlHttpOrder){
        var vOrderObject = JSON.parse(paramXmlHttpOrder.responseText);
        var vInputOrderIdElement = document.getElementById("input-order-id");
        var vSelectComboSizeElement = document.getElementById("select-combo");
        var vInputDuongKinhElement = document.getElementById("input-duong-kinh");
        var vSelectDrinkElement = document.getElementById("select-drink");
        var vInputSoLuongNuocElement = document.getElementById("input-so-luong-nuoc");
        var vInputVoucherElement = document.getElementById("input-voucher");
        var vInputLoaiPizzaElement = document.getElementById("input-loai-pizza");
        var vInputSaladElement = document.getElementById("input-salad");
        var vInputThanhTienElement = document.getElementById("input-thanh-tien");
        var vInputGiamGiaElement = document.getElementById("input-giam-gia");
        var vInputHoVaTenElement = document.getElementById("input-ho-va-ten");
        var vInputEmailElement = document.getElementById("input-email");
        var vInputSoDienThoaiElement = document.getElementById("input-so-dien-thoai");
        var vInputDiaChiElement = document.getElementById("input-dia-chi");
        var vInputLoiNhanElement = document.getElementById("input-loi-nhan");
        var vInputStatusElement = document.getElementById("input-status");
        var vInputNgayTaoDonElement = document.getElementById("input-ngay-tao-don");
        var vInputNgayCapNhatElement = document.getElementById("input-ngay-cap-nhat");


        vInputOrderIdElement.value = vOrderObject.orderId;
        
        vInputDuongKinhElement.value = vOrderObject.duongKinh;
        
        vInputSoLuongNuocElement.value = vOrderObject.soLuongNuoc;
        vInputVoucherElement.value = vOrderObject.idVourcher;
        vInputLoaiPizzaElement.value = vOrderObject.loaiPizza;
        vInputSaladElement.value = vOrderObject.salad;
        vInputThanhTienElement.value = vOrderObject.thanhTien;
        vInputGiamGiaElement.value = vOrderObject.giamGia;
        vInputHoVaTenElement.value = vOrderObject.hoTen;
        vInputEmailElement.value = vOrderObject.email;
        vInputSoDienThoaiElement.value = vOrderObject.soDienThoai;
        vInputDiaChiElement.value = vOrderObject.diaChi;
        vInputLoiNhanElement.value = vOrderObject.loiNhan;
        vInputStatusElement.value = vOrderObject.trangThai;
        vInputNgayTaoDonElement.value = vOrderObject.ngayTao;
        vInputNgayCapNhatElement.value = vOrderObject.ngayCapNhat;

        // nếu người dùng chọn size S, M or L
        if (vOrderObject.kichCo == "size S"){
            var vSelectComboSizeElement = document.getElementById("select-combo");
            vSelectComboSizeElement.value = vOrderObject.kichCo;
            var vOptionComboSizeElement = vSelectComboSizeElement.options[vSelectComboSizeElement.selectedIndex].value;
        }
        else if(vOrderObject.kichCo == "size M"){
            var vSelectComboSizeElement = document.getElementById("select-combo");
            vSelectComboSizeElement.value = vOrderObject.kichCo;
            var vOptionComboSizeElement = vSelectComboSizeElement.options[vSelectComboSizeElement.selectedIndex].value;
    
        }
        else if(vOrderObject.kichCo == "size L"){
            var vSelectComboSizeElement = document.getElementById("select-combo");
            vSelectComboSizeElement.value = vOrderObject.kichCo;
            var vOptionComboSizeElement = vSelectComboSizeElement.options[vSelectComboSizeElement.selectedIndex].value;
        }

        // chọn đồ uống
        var vSelectDrinkElement = document.getElementById("select-drink");
        vSelectDrinkElement.options[vSelectDrinkElement.selectedIndex].text = vOrderObject.idLoaiNuocUong;

    }