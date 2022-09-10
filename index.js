"use strict";
    /*** Vùng 1: Khai báo biến toàn cục ***/
    const gREQUEST_STATUS_OK = 200;
    const gREQUEST_READY_STATUS_FINISH_AND_OK = 4;
    const gREQUEST_CREATE_SUCCESS = 201; // status 201 tao thanh cong
    // bạn có thê dùng để lưu trữ combo được chọn, mỗi khi khách chọn bạn lại đổi giá trị properties của nó
    var gSelectedMenuStructure = {
      menuName: "...",    // S, M, L
      duongKinhCM: 0,
      suonNuong: 0,
      saladGr: 0,
      drink: 0,
      priceVND: 0,
      sizePizzaDuocChon () {
        console.log("Cỡ pizza được chọn: " + this.menuName);
      }
    }
    // bạn có thể dùng để lưu loại pizza đươc chọn, mỗi khi khách chọn, bạn lại đổi giá trị cho nó
    var gSelectedPizzaType = {
      typeName: "..."
    }
    // lưu loại đồ uống được chọn
    var gSelectDrinkType = null;
    // lưu thông tin đơn hàng
    var gThongTinDonHang = null;
    // lưu id và orderId sau khi ấn nút gửi đơn để thêm vào query string
    var gId = 0;
    var gOrderId = 0;
    var gDiscount = 0;
    var gThanhTien = 0;
    /*** Vùng 2: Event Handler - Vùng xử lý sự kiện ***/
    // hàm tải trang - page loading
    function onPageLoading (){
      // load dữ liệu đồ uống vào ô chọn đồ uống
      loadDrinkListFormApi();
    }
    //selected the size M
    function onBtnSizeMClick() {
      "use strict";
      // map lựa chọn vào gSelectedMenuStructure, chỗ này còn rất nhiều properties tôi chưa gán
      getDataFromMenuCombo("size M", "25 cm", 4, "300 g", 3, 200000);
      
      //set trạng thái của nut - set the buttons style 
      setMenuButtonsColor(gSelectedMenuStructure.menuName);
      console.log(gSelectedMenuStructure);
      // đay là ví dụ để bạn đẩy view đến 01 element khác (focus vào vùng đó)
      document.getElementById("about").scrollIntoView();
    }
    //selected the size L
    function onBtnSizeLClick() {
      "use strict";
      // map lựa chọn vào gSelectedMenuStructure  //chỗ này còn nhiều properties tôi chưa gán
      getDataFromMenuCombo("size L", "30 cm", 8, "500 g", 4, 250000);
      
      //set trạng thái của nut - set the buttons style 
      setMenuButtonsColor(gSelectedMenuStructure.menuName);
      console.log(gSelectedMenuStructure);
      // đay là ví dụ để bạn đẩy view đến 01 element khác (focus vào vùng đó)
      document.getElementById("about").scrollIntoView();
    }
    //selected the size S
    function onBtnSizeSClick() {
      "use strict";
      // map lựa chọn vào gSelectedMenuStructure
       //chỗ này còn nhiều dòng code nữa, nhiều properties tôi chưa gán
      getDataFromMenuCombo("size S", "20 cm", 2, "200 g", 2, 150000);
      
      //set trạng thái của nut - set the buttons style 
      setMenuButtonsColor(gSelectedMenuStructure.menuName);
      console.log(gSelectedMenuStructure);
      // đay là ví dụ để bạn đẩy view đến 01 element khác (focus vào vùng đó)
      document.getElementById("about").scrollIntoView();
    }

    // select type : Seafood Pizza
    function onBtnSeafoodPizzaClick(){
      "use strict";
      gSelectedPizzaType.typeName = "Seafood Pizza";
      // đổi màu nút khi chọn
      setTypeButtonsColor(gSelectedPizzaType.typeName);
      console.log(gSelectedPizzaType);
      // đay là ví dụ để bạn đẩy view đến 01 element khác (focus vào vùng đó)
      document.getElementById("drink").scrollIntoView();
    }
    // select type : Chicken Pizza
    function onBtnChickenPizzaClick(){
      "use strict";
      gSelectedPizzaType.typeName = "Chicken Pizza";
      // đổi màu nút khi chọn
      setTypeButtonsColor(gSelectedPizzaType.typeName);
      console.log(gSelectedPizzaType);
      // đay là ví dụ để bạn đẩy view đến 01 element khác (focus vào vùng đó)
      document.getElementById("drink").scrollIntoView();
    }
    // select type : Barbecue Pizza
    function onBtnBarbecuePizzaClick(){
      "use strict";
      gSelectedPizzaType.typeName = "Barbecue Pizza";
      // đổi màu nút khi chọn
      setTypeButtonsColor(gSelectedPizzaType.typeName);
      console.log(gSelectedPizzaType);
      // đay là ví dụ để bạn đẩy view đến 01 element khác (focus vào vùng đó)
      document.getElementById("drink").scrollIntoView();
    }


    // hàm xử lí khi nhấn nút kiểm tra đơn
    function onBtnKiemTraDonClick(){
      // kiểm tra đã chọn menu và type Pizza và đồ uống
      var vSelectDrink = document.getElementById("select-drink");
      gSelectDrinkType = vSelectDrink.value;

      if (gSelectedMenuStructure.menuName == "..." ){
        alert("Vui lòng chọn Combo size Pizza!");
        return true;
      }
      else if(gSelectedPizzaType.typeName == "..."){
        alert("Vui lòng chọn loại Pizza!");
        return true;
      }
      else if(gSelectDrinkType == "DRINK_NOT_SELECTED"){
        alert("Vui lòng chọn loại đồ uống!");
        return true;
      }
      else{
        // khai báo đối tượng :  thông tin người đặt hàng
        var vThongTinDonHang = {
          menuDuocChon: "",
          loaiPizza: "",
          loaiNuocUong: "",
          hoVaTen: "",
          email: "",
          dienThoai: "",
          diaChi: "",
          loiNhan: "",
          voucher: "",
          priceAnnualVND() {
              return gSelectedMenuStructure.priceVND*(1-(this.discount/100));
          },
          discount: 0
        }
        // b1: get data form form
          getDataDonHangFromForm(vThongTinDonHang);
          // b2: validate data
          var vValidated = validateDataFromForm(vThongTinDonHang);
            if (vValidated){
              // b3: hiển thị dữ liệu
              showDataDonHang(vThongTinDonHang);
            }
          gThongTinDonHang = vThongTinDonHang;
        }
       
    }

    // hàm xử lý khi nhấn nút gửi đơn
    function onBtnGuiDonClick(){
      "use strict";
      
      var vDivContainer = document.getElementById("div-container");
      var vDivCamOn = document.getElementById("div-cam-on");
      vDivContainer.style.display  = "none";
      vDivCamOn.style.display = "block";
      
      // khai báo đối tượng lưu trên form
      var vDonHangObject = {
        kichCo: "",
        duongKinh: "",
        suon: "",
        salad: "",
        loaiPizza: "",
        idVourcher: "",
        idLoaiNuocUong: "",
        soLuongNuoc: "",
        hoTen: "",
        thanhTien: "",
        email: "",
        soDienThoai: "",
        diaChi: "",
        loiNhan: ""
      };
      // b1: thu thập dữ liệu
      vDonHangObject.kichCo = gThongTinDonHang.menuDuocChon;
      vDonHangObject.duongKinh = gSelectedMenuStructure.duongKinhCM;
      vDonHangObject.suon = gSelectedMenuStructure.suonNuong;
      vDonHangObject.salad = gSelectedMenuStructure.saladGr;
      vDonHangObject.loaiPizza = gSelectedPizzaType.typeName;
      vDonHangObject.idVourcher = gThongTinDonHang.voucher;
      vDonHangObject.idLoaiNuocUong = gSelectDrinkType;
      vDonHangObject.soLuongNuoc = gSelectedMenuStructure.drink;
      vDonHangObject.hoTen = gThongTinDonHang.hoVaTen;
      vDonHangObject.thanhTien = gThanhTien;
      vDonHangObject.email = gThongTinDonHang.email;
      vDonHangObject.soDienThoai = gThongTinDonHang.dienThoai;
      vDonHangObject.diaChi = gThongTinDonHang.diaChi;
      vDonHangObject.loiNhan = gThongTinDonHang.loiNhan;
      // call Api để tạo đơn hàng (ghi dữ liệu vào sercer)
      var vXmlHttpCreateOrder= new XMLHttpRequest();
      callApiCreateOrder(vXmlHttpCreateOrder, vDonHangObject);
      vXmlHttpCreateOrder.onreadystatechange = function () {
        if (this.readyState == gREQUEST_READY_STATUS_FINISH_AND_OK && this.status == gREQUEST_CREATE_SUCCESS){
          var bCreatedOrderJson = vXmlHttpCreateOrder.responseText;
          console.log(bCreatedOrderJson);
          var bCreateOrderObject = JSON.parse(bCreatedOrderJson);
          var vInputOrderId = document.getElementById("inp-order-id");
          vInputOrderId.value = bCreateOrderObject.orderId;

          // lưu giá trị id và orderId
          gId = bCreateOrderObject.id;
          gOrderId = bCreateOrderObject.orderId;
        }
      }
    }

    // hàm xử lý khi ấn Order Detail 
    function onOrderDetailClick(){
      console.log(gId + " " + gOrderId);
      var vUrlSiteOpen = "viewOrder.html" + "?" 
          + "id=" + gId + "&"
          + "orderId=" + gOrderId ;
           window.location.href = vUrlSiteOpen; 
    }

    /*** Vùng 3: Vùng khai báo hàm dùng chung ***/

    //set trạng thái của 03 nút trong menu (tại price pannel) 
    function setMenuButtonsColor(paramSelectedMenuName) {
      "use strict";
      //truy vấn 03 nút
      console.log("selected menu .. = " + paramSelectedMenuName); //tracking
      var vSelectSizeMButton = document.getElementById("sizeM");
      var vSelectSizeLButton = document.getElementById("sizeL");
      var vSelectSizeSButton = document.getElementById("sizeS");
      // set classname cho 03 nút này, tùy và lựa chon là gì
      if (paramSelectedMenuName == "size S") {
        vSelectSizeSButton.className = "btn btn-warning"; //oragge
        vSelectSizeMButton.className = "btn btn-success";
        vSelectSizeLButton.className = "btn btn-success";
      }
      else if (paramSelectedMenuName == "size M") {
        vSelectSizeSButton.className = "btn btn-success";
        vSelectSizeMButton.className = "btn btn-warning"; //orange
        vSelectSizeLButton.className = "btn btn-success";

      } else if (paramSelectedMenuName == "size L") {
        vSelectSizeSButton.className = "btn btn-success";
        vSelectSizeMButton.className = "btn btn-success";
        vSelectSizeLButton.className = "btn btn-warning"; //orange
      }
    }

    // hàm lấy dữ liệu từ menu 
    function getDataFromMenuCombo(paramMenuName, paramDuongKinh, paramSuonNuong, paramSalad, paramDrink, paramPriceVND ){
      gSelectedMenuStructure.menuName = paramMenuName;
      gSelectedMenuStructure.duongKinhCM = paramDuongKinh;
      gSelectedMenuStructure.suonNuong = paramSuonNuong;
      gSelectedMenuStructure.saladGr = paramSalad;
      gSelectedMenuStructure.drink = paramDrink;
      gSelectedMenuStructure.priceVND = paramPriceVND;
    }

    //set trạng thái của 03 nút trong menu chọn loại pizza
    function setTypeButtonsColor(paramSelectedTypeName) {
      "use strict";
      //truy vấn 03 nút
      console.log("selected type .. = " + paramSelectedTypeName); //tracking
      var vSelectSeafoodButton = document.getElementById("select-seafood");
      var vSelectChickenButton = document.getElementById("select-chicken");
      var vSelectBarbecueButton = document.getElementById("select-barbecue");
      // set classname cho 03 nút này, tùy và lựa chon là gì 
      if (paramSelectedTypeName == "Seafood Pizza") {
        vSelectSeafoodButton.className = "btn btn-warning w-100"; //oragge
        vSelectChickenButton.className = "btn btn-success w-100";
        vSelectBarbecueButton.className = "btn btn-success w-100";
      }
      else if (paramSelectedTypeName == "Chicken Pizza") {
        vSelectSeafoodButton.className = "btn btn-success w-100";
        vSelectChickenButton.className = "btn btn-warning w-100"; //orange
        vSelectBarbecueButton.className = "btn btn-success w-100";

      } else if (paramSelectedTypeName == "Barbecue Pizza") {
        vSelectSeafoodButton.className = "btn btn-success w-100";
        vSelectChickenButton.className = "btn btn-success w-100";
        vSelectBarbecueButton.className = "btn btn-warning w-100"; //orange
      }
    }

    // hàm lấy dữ liệu đồ uống từ api và load vào mục chọn đồ uống
    function loadDrinkListFormApi(){
      "use strict";
      const vBASE_URL = "http://42.115.221.44:8080/devcamp-pizza365/drinks";
      // call api lấy dữ liệu
      var vXmlHttpDrink = new XMLHttpRequest;
      vXmlHttpDrink.onreadystatechange =
            function () {
                if (this.readyState == gREQUEST_READY_STATUS_FINISH_AND_OK && this.status == gREQUEST_STATUS_OK) {
                    handlerDrinkListToForm(vXmlHttpDrink);
                }
            };
            vXmlHttpDrink.open("GET",vBASE_URL, true);
            vXmlHttpDrink.send();
    }

    // hàm hiển thị danh sách đồ uống vào mục chọn đồ uống
    function handlerDrinkListToForm(paramXmlHttpDrink){
      var vSelectDrinkElement = document.getElementById("select-drink");
      var vDrinkListArray = JSON.parse(paramXmlHttpDrink.responseText);
      for (var bI = 0; bI < vDrinkListArray.length; bI ++){
        var vOptionDrinkElement = document.createElement("option");
        vOptionDrinkElement.value = vDrinkListArray[bI].maNuocUong;
        vOptionDrinkElement.text = vDrinkListArray[bI].tenNuocUong;
        vSelectDrinkElement.appendChild(vOptionDrinkElement);
        
      }
    }
  
    // hàm lấy dữ liệu từ form
    function getDataDonHangFromForm(paramThongTinDonHang){
      "use strict";
      var vSelectDrink = document.getElementById("select-drink");
      var vInputHoVaTen = document.getElementById("inp-fullname");
      var vInputEmail = document.getElementById("inp-email");
      var vInputDienThoai = document.getElementById("inp-dien-thoai");
      var vInputDiaChi = document.getElementById("inp-dia-chi");
      var vInputLoiNhan = document.getElementById("inp-message");
      var vInputVoucherId = document.getElementById("inp-voucher");

      paramThongTinDonHang.menuDuocChon = gSelectedMenuStructure.menuName;
      paramThongTinDonHang.loaiPizza = gSelectedPizzaType.typeName;
      paramThongTinDonHang.loaiNuocUong = vSelectDrink.text;

      paramThongTinDonHang.hoVaTen = vInputHoVaTen.value.trim();
      paramThongTinDonHang.email = vInputEmail.value.trim();
      paramThongTinDonHang.dienThoai = vInputDienThoai.value.trim();
      paramThongTinDonHang.diaChi = vInputDiaChi.value.trim();
      paramThongTinDonHang.loiNhan = vInputLoiNhan.value.trim();
      

      // lấy dữ liệu phần trăm giảm giá dựa vào voucher 
      const vBASE_URL = "http://42.115.221.44:8080/devcamp-voucher-api/voucher_detail";
      var vValueVoucherId = vInputVoucherId.value.trim();  //một số mã đúng để test: 95531, 81432,...
      if (vValueVoucherId != 0){
        var vXmlHttpDiscount = new XMLHttpRequest();
        vXmlHttpDiscount.open("GET", vBASE_URL + "/" + vValueVoucherId , false);
        vXmlHttpDiscount.send(null);
            if (vXmlHttpDiscount.status == gREQUEST_STATUS_OK) { // restFullAPI successful
                // nhận lại response dạng JSON ở xmlHttp.responseText và chuyển thành object
                console.log(vXmlHttpDiscount.responseText);
                var vVoucherObject = JSON.parse(vXmlHttpDiscount.responseText);
                paramThongTinDonHang.discount = vVoucherObject.phanTramGiamGia;
                paramThongTinDonHang.voucher = vVoucherObject.maVoucher;
                gThanhTien = gSelectedMenuStructure.priceVND*(1-(paramThongTinDonHang.discount/100));
            }
            else {
                // không nhận lại được data do vấn đề gì đó: khả năng mã voucher ko dúng
                console.log("Không tìm thấy voucher " + vXmlHttpDiscount.responseText);
            }
        }
      }

    // hàm validate dữ liệu đơn hàng lấy từ form
    function validateDataFromForm(paramThongTinDonHang){
      if (paramThongTinDonHang.hoVaTen == ""){
        alert("Vui lòng điền họ và tên!");
        return false;
      }
      if (paramThongTinDonHang.email == ""){
        alert("Vui lòng điền email!");
        return false;
      }
      if (validateEmail(paramThongTinDonHang.email) == false){
        alert("Email nhập vào không hợp lệ!");
        return false;
      }
      if (paramThongTinDonHang.dienThoai == ""){
        alert("Vui lòng nhập số điện thoại!");
        return false;
      }
      if (paramThongTinDonHang.diaChi == ""){
        alert("Vui lòng nhập địa chỉ!");
        return false;
      }
      return true;
    }

    // Hàm kiểm tra định dạng email
    function validateEmail(paramEmail) {
      var vValidRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (paramEmail.match(vValidRegex)) {
          return true;
        } else {
          return false;
        }
    }

    // hàm hiển thị dữ liệu nhập vào vùng xanh
    function showDataDonHang(paramThongTinDonHang){
      var vDivConatinerThongTin = document.getElementById("div-container");
      var vPThongTin = document.getElementById("thong-tin-don-hang");

      vDivConatinerThongTin.style.display = "block";
      vPThongTin.innerHTML = "Họ và tên: " + paramThongTinDonHang.hoVaTen + "<br>";
      vPThongTin.innerHTML += "Email: " + paramThongTinDonHang.email + "<br>";
      vPThongTin.innerHTML += "Điện thoại: " + paramThongTinDonHang.dienThoai + "<br>";
      vPThongTin.innerHTML += "Địa chỉ: " + paramThongTinDonHang.diaChi + "<br>";
      vPThongTin.innerHTML += "Lời nhắn: " + paramThongTinDonHang.loiNhan + "<br>";

      vPThongTin.innerHTML += "-------------------------" + "<br>";

      vPThongTin.innerHTML += "Kích cỡ: " + gSelectedMenuStructure.menuName + "<br>";
      vPThongTin.innerHTML += "Đường kính: " + gSelectedMenuStructure.duongKinhCM + "<br>";
      vPThongTin.innerHTML += "Sườn nướng: " + gSelectedMenuStructure.suonNuong + "<br>";
      vPThongTin.innerHTML += "Salad: " + gSelectedMenuStructure.saladGr + "<br>";
      vPThongTin.innerHTML += "Số lượng nước ngọt: " + gSelectedMenuStructure.drink + "<br>";

      vPThongTin.innerHTML += "-------------------------"+ "<br>";

      vPThongTin.innerHTML += "Loại Pizza: " + paramThongTinDonHang.loaiPizza + "<br>";
      vPThongTin.innerHTML += "Loại nước uống: " + gSelectDrinkType + "<br>";
      vPThongTin.innerHTML += "Mã voucher: " + paramThongTinDonHang.voucher + "<br>";
      vPThongTin.innerHTML += "Giá VND: " + gSelectedMenuStructure.priceVND + "<br>";
      vPThongTin.innerHTML += "Discount: " + paramThongTinDonHang.discount + " %" + "<br>";
      vPThongTin.innerHTML += "Phải thanh toán: " + gThanhTien + " VND" + "<br>";
    }
  
    // hàm gọi Api để tạo đơn hàng
    function callApiCreateOrder(paramXmlHttpCreateOrder, paramDonHangObj){
      const vBASE_URL = "http://42.115.221.44:8080/devcamp-pizza365/orders";
      paramXmlHttpCreateOrder.open("POST", vBASE_URL, true);
      paramXmlHttpCreateOrder.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      paramXmlHttpCreateOrder.send(JSON.stringify(paramDonHangObj));
    }