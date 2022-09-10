"use strict";
    /*** REGION 1 - Global variables - Vùng khai báo biến, hằng số, tham số TOÀN CỤC */
        var gId = 0;

        const gREQUEST_STATUS_OK = 200;
        const gREQUEST_CREATE_OK = 201; // status 201 là tạo mới thành công
        const gREQUEST_READY_STATUS_FINISH_AND_OK = 4;
        const gBASE_URL = "http://42.115.221.44:8080/devcamp-pizza365/orders";
    /*** REGION 2 - Vùng gán / thực thi sự kiện cho các elements */
    

    /*** REGION 3 - Event handlers - Vùng khai báo các hàm xử lý sự kiện */
    // hàm tải trang
    function onPageLoading(){
        "use strict";
        // lấy dữ liệu điền vào select drink
        loadDataDrinkList();
        // b1: thu thập dữ liệu
        const params = new URLSearchParams(window.location.search);
        var gOrderId = params.get("orderid");
        console.log("OrderId là: " + gOrderId);
        // b2: validate
        if (gOrderId == null ){
            alert("Thiếu tham số Order id");
            window.location.href = "OrderList.html";
        }
        else{
            // b3: gọi api để lấy dữ liệu order
            var vXmlHttp = new XMLHttpRequest;
            callApiOrderByOrderId(gOrderId, vXmlHttp);
            // b4: hiển thị dữ liệu order trên form
            vXmlHttp.onreadystatechange = function () {
                if (this.readyState == gREQUEST_READY_STATUS_FINISH_AND_OK && this.status == gREQUEST_STATUS_OK) {
                    console.log(vXmlHttp.responseText); // ghi response text ra console.log
                    showOrderDetailToForm(vXmlHttp);
                }
            };
        }
    }

     // hàm xử lý sự kiện ấn nút Confirm
    function onBtnConfirmClick(){
    // khai báo đối tượng để lưu dữ liệu từ form
    var vOrderObject = {
        orderId: "",
        kichCo: "",
        duongKinh: "",
        suonNuong: "",
        voucherId: "",
        loaiPizza: "",
        nuocUong: "",
        soLuongNuoc: "",
        salad: "",
        thanhTien: "",
        hoTen: "",
        email: "",
        soDienThoai: "",
        trangThai: "",
        loiNhan: "",
        ngayTao: "",
        ngayNhap: ""
    };
    
        // b1: thu thập dữ liệu
         readDataOrderFromForm(vOrderObject);
        // b2: validate 
        var vValidatedData = validateDataOrder(vOrderObject);
        if (vValidatedData){
            // b3: gọi Api để sửa thông tin
            var xmlHttpUpdateOrder = new XMLHttpRequest();
            callApiConfirmOrder(vOrderObject, xmlHttpUpdateOrder);
            xmlHttpUpdateOrder.onreadystatechange = function () {
            if (this.readyState == gREQUEST_READY_STATUS_FINISH_AND_OK && this.status == gREQUEST_STATUS_OK){
                // b4: xử lý front-end (thông báo sửa thành công)
                console.log("Id: " + vOrderObject.orderId);
                var updatedOrder = xmlHttpUpdateOrder.responseText;
                console.log(updatedOrder);
                thongBaoThanhCong();
            }
            };
    
        }
  
    }

    // hàm sự kiện khi nút Cancel được nhấn
    function onBtnCancelClick(){
        "use strict";
        // khai báo đối tượng để lưu dữ liệu từ form
        var vOrderObject = {
            trangThai: "cancel"
            }
        // b3: gọi Api để sửa thông tin
        var xmlHttpUpdateOrder = new XMLHttpRequest();
            callApiConfirmOrder(vOrderObject, xmlHttpUpdateOrder);
            xmlHttpUpdateOrder.onreadystatechange = function () {
            if (this.readyState == gREQUEST_READY_STATUS_FINISH_AND_OK && this.status == gREQUEST_STATUS_OK){
                // b4: xử lý front-end (thông báo sửa thành công)
                window.location.href = "OrderList.html";
            }
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

    // hàm gọi Api
    function callApiOrderByOrderId(paramOrderId, paramXmlHttp){
        paramXmlHttp.open("GET", gBASE_URL + "/" + paramOrderId, true);
        paramXmlHttp.send();
    }

    // hàm hiển thị dữ liệu lên form
    function showOrderDetailToForm(paramXmlHttp){
        var vOrderDetailObject = JSON.parse(paramXmlHttp.responseText);
        var vInputOrderIdElement = document.getElementById("input-order-id");
        var vSelectComboSizeElement = document.getElementById("select-combo");
        var vInputDuongKinhElement = document.getElementById("input-duong-kinh");
        var vInputSuonNuongElement = document.getElementById("input-suon-nuong");
        var vInputDoUongElement = document.getElementById("select-drink");
        var vInputSoLuongNuocElement = document.getElementById("input-so-luong-nuoc");
        var vInputVoucherElement = document.getElementById("input-voucher");
        var vInputLoaiPizzaElement = document.getElementById("input-loai-pizza");
        var vInputSaladElement = document.getElementById("input-salad");
        var vInputThanhTienIdElement = document.getElementById("input-thanh-tien");
        var vInputGiamGiaElement = document.getElementById("input-giam-gia");
        var vInputHoVaTenElement = document.getElementById("input-ho-va-ten");
        var vInputEmailElement = document.getElementById("input-email");
        var vInputSoDienThoaiElement = document.getElementById("input-so-dien-thoai");
        var vInputDiaChiElement = document.getElementById("input-dia-chi");
        var vInputLoiNhanElement = document.getElementById("input-loi-nhan");
        var vInputStatusElement = document.getElementById("input-status");
        var vInputNgayTaoDonElement = document.getElementById("input-ngay-tao-don");
        var vInputNgayCapNhatElement = document.getElementById("input-ngay-cap-nhat");

        vInputOrderIdElement.value = vOrderDetailObject.orderId;
        vInputDuongKinhElement.value = vOrderDetailObject.duongKinh;
        vInputSuonNuongElement.value = vOrderDetailObject.suon;
        vInputDoUongElement.value = vOrderDetailObject.idLoaiNuocUong;
        vInputSoLuongNuocElement.value = vOrderDetailObject.soLuongNuoc;
        vInputVoucherElement.value = vOrderDetailObject.idVourcher;
        vInputLoaiPizzaElement.value = vOrderDetailObject.loaiPizza;
        vInputSaladElement.value = vOrderDetailObject.salad;
        vInputThanhTienIdElement.value = vOrderDetailObject.thanhTien;
        vInputGiamGiaElement.value = vOrderDetailObject.giamGia;
        vInputHoVaTenElement.value = vOrderDetailObject.hoTen;
        vInputEmailElement.value = vOrderDetailObject.email;
        vInputSoDienThoaiElement.value = vOrderDetailObject.soDienThoai;
        vInputDiaChiElement.value = vOrderDetailObject.diaChi;
        vInputLoiNhanElement.value = vOrderDetailObject.loiNhan;
        vInputStatusElement.value = vOrderDetailObject.trangThai;
        vInputNgayTaoDonElement.value = vOrderDetailObject.ngayTao;
        vInputNgayCapNhatElement.value = vOrderDetailObject.ngayCapNhat;

        // nếu người dùng chọn size S, M or L
        if (vOrderDetailObject.kichCo == "size S"){
            var vSelectComboSizeElement = document.getElementById("select-combo");
            vSelectComboSizeElement.value = "size S";
        }
        else if(vOrderDetailObject.kichCo == "size M"){
            var vSelectComboSizeElement = document.getElementById("select-combo");
            vSelectComboSizeElement.value = "size M";
        }
        else if(vOrderDetailObject.kichCo == "size L"){
            var vSelectComboSizeElement = document.getElementById("select-combo");
            vSelectComboSizeElement.value = "size L";
        }

        if (vInputDoUongElement.value = vOrderDetailObject.idLoaiNuocUong){

        }
    }

    // hàm read data form form
    function readDataOrderFromForm(paramOrderObj){
        var vInputOrderIdElement = document.getElementById("input-order-id");
        var vSelectComboSizeElement = document.getElementById("select-combo");
        var vInputDuongKinhElement = document.getElementById("input-duong-kinh");
        var vInputSuonNuongElement = document.getElementById("input-suon-nuong");
        var vInputDoUongElement = document.getElementById("select-drink");
        var vInputSoLuongNuocElement = document.getElementById("input-so-luong-nuoc");
        var vInputVoucherElement = document.getElementById("input-voucher");
        var vInputLoaiPizzaElement = document.getElementById("input-loai-pizza");
        var vInputSaladElement = document.getElementById("input-salad");
        var vInputThanhTienIdElement = document.getElementById("input-thanh-tien");
        var vInputGiamGiaElement = document.getElementById("input-giam-gia");
        var vInputHoVaTenElement = document.getElementById("input-ho-va-ten");
        var vInputEmailElement = document.getElementById("input-email");
        var vInputSoDienThoaiElement = document.getElementById("input-so-dien-thoai");
        var vInputDiaChiElement = document.getElementById("input-dia-chi");
        var vInputLoiNhanElement = document.getElementById("input-loi-nhan");
        var vInputStatusElement = document.getElementById("input-status");
        var vInputNgayTaoDonElement = document.getElementById("input-ngay-tao-don");
        var vInputNgayCapNhatElement = document.getElementById("input-ngay-cap-nhat");

        paramOrderObj.orderId = vInputOrderIdElement.value.trim();
        paramOrderObj.duongKinh = vInputDuongKinhElement.value.trim();
        paramOrderObj.suonNuong = vInputSoLuongNuocElement.value.trim();
        paramOrderObj.soLuongNuoc = vInputSoLuongNuocElement.value.trim();
        paramOrderObj.voucherId = vInputVoucherElement.value.trim();
        paramOrderObj.salad = vInputSaladElement.value.trim();
        paramOrderObj.giamGia = vInputGiamGiaElement.value.trim();
        paramOrderObj.kichCo = vSelectComboSizeElement.value.trim();
        paramOrderObj.nuocUong = vInputDoUongElement.value;
        paramOrderObj.loaiPizza = vInputLoaiPizzaElement.value.trim();
        paramOrderObj.thanhTien = vInputThanhTienIdElement.value.trim();
        paramOrderObj.hoTen = vInputHoVaTenElement.value.trim();
        paramOrderObj.email = vInputEmailElement.value.trim();
        paramOrderObj.soDienThoai = vInputSoDienThoaiElement.value.trim();
        paramOrderObj.diaChi = vInputDiaChiElement.value.trim();
        paramOrderObj.trangThai = "confirmed";
        paramOrderObj.loiNhan = vInputLoiNhanElement.value.trim();
        paramOrderObj.ngayTao = vInputNgayTaoDonElement.value.trim();
        paramOrderObj.ngayNhap = vInputNgayCapNhatElement.value.trim();
    }

    // hàm validate data from form
    function validateDataOrder(paramOrderObj){
        if (paramOrderObj.orderId == ""){
        alert("Vui lòng nhập Order Id!");
        return false;
        }
        if (paramOrderObj.kichCo == ""){
        alert("Vui lòng nhập size Pizza!");
        return false;
        }
        if (paramOrderObj.duongKinh == ""){
        alert("Vui lòng nhập đường kính Pizza!");
        return false;
        }
        if (paramOrderObj.suonNuong == ""){
        alert("Vui lòng nhập số lượng sườn!");
        return false;
        }
        if (paramOrderObj.nuocUong == ""){
        alert("Vui lòng nhập đồ uống!");
        return false;
        }
        if (paramOrderObj.soLuongNuoc == ""){
        alert("Vui lòng nhập số lượng nước!");
        return false;
        }
        if (paramOrderObj.voucherId == ""){
        alert("Vui lòng nhập voucher Id!");
        return false;
        }
        if (paramOrderObj.loaiPizza == ""){
        alert("Vui lòng nhập loại Pizza!");
        return false;
        }
        if (paramOrderObj.salad == ""){
        alert("Vui lòng nhập số gam salad!");
        return false;
        }
        if (paramOrderObj.hoTen == ""){
        alert("Vui lòng nhập họ và tên!");
        return false;
        }
        if (paramOrderObj.email == ""){
        alert("Vui lòng nhập email!");
        return false;
        }
        if (paramOrderObj.soDienThoai == ""){
        alert("Vui lòng nhập số điện thoại!");
        return false;
        }
        if (paramOrderObj.diaChi == ""){
        alert("Vui lòng nhập địa chỉ!");
        return false;
        }
        if (paramOrderObj.loiNhan == ""){
        alert("Vui lòng nhập lời nhắn!");
        return false;
        }
        if (paramOrderObj.trangThai == ""){
        alert("Vui lòng nhập trạng thái!");
        return false;
        }
        if (paramOrderObj.ngayTao == ""){
        alert("Vui lòng nhập ngày tạo đơn !");
        return false;
        }
        if (paramOrderObj.ngayNhap == ""){
        alert("Vui lòng nhập ngày cập nhật!");
        return false;
        }
        return true;
    }

    // hàm call api để sửa đơn hàng
    function callApiConfirmOrder(paramOrderObj, paramXmlHttp){
        const vBASE_URL = "http://42.115.221.44:8080/devcamp-pizza365/orders";
        const params = new URLSearchParams(window.location.search);
        var gId = params.get('id');
        paramXmlHttp.open("PUT", vBASE_URL + "/" + gId);
        paramXmlHttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
        paramXmlHttp.send(JSON.stringify(paramOrderObj));
    }

    // hàm thông báo confirm thành công
    function thongBaoThanhCong(){
        alert("Cập nhật thông tin đơn hàng thành công!");
        window.location.href = "OrderList.html";
    }