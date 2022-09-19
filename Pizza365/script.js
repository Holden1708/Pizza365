$(document).ready(function(){
    /*** REGION 1 - Global variables - Vùng khai báo biến, hằng số, tham số TOÀN CỤC */

    // lưu trữ combo được chọn, mỗi khi khách chọn bạn lại đổi giá trị properties của nó
    var gSelectedMenuStructure = {
        menuName: "",    // S, M, L
        duongKinh: "",
        suon: "",
        salad: "",
        drink: "",
        priceVND: 0
    };

    // lưu dữ liệu loại pizza được chọn
    var gSelectedPizzaType = {
        typeName: "",
    };

    // lưu loại đồ uống được chọn
    var gSelectDrinkType = null;

    // lưu thông tin người mua
    var gThongTinNguoiMua = {
        menuName: "",
        typeName: "",
        drink: "",
        hoTen: "",
        email: "",
        soDienThoai: "",
        diaChi: "",
        voucherId: "",
        discount: 0,
        giamGia: 0,
        thanhTien: 0,
        loiNhan: ""
    };

    // lưu orderId và Id nếu tạo một đơn hàng thành công
    var gOrderId = null;
    var gId = null;

    /*** REGION 2 - Vùng gán / thực thi hàm xử lý sự kiện cho các elements */
      
        // gọi hàm tải trang
        onPageLoading();

        // gán sự kiện ấn nút size S
        $("#sizeS").on("click", function(){
            onBtnSizeSClick();
        });

        // gán sự kiện ấn nút size M
        $("#sizeM").on("click", function(){
            onBtnSizeMClick();
        });

        // gán sự kiện ấn nút size L
        $("#sizeL").on("click", function(){
            onBtnSizeLClick();
        })

        // gán sự kiện ấn nút chọn pizza Hawaii
        $("#select-hawaii").on("click", function(){
            onBtnHawaiiPizzaClick();
        });

        // gán sự kiện ấn nút chọn pizza Seafood
        $("#select-seafood").on("click", function(){
            onBtnSeafoodPizzaClick();
        });

        // gán sự kiện ấn nút chọn pizza Bacon
        $("#select-bacon").on("click", function(){
            onBtnBaconPizzaClick();
        });

        // gán sự kiện ấn nút Gửi
        $("#btn-gui").on("click",function(){
            onBtnGuiDonHangClick();
        });

        // gán sự kiện ấn nút tạo đơn trên modal
        $("#btn-tao-don").on("click", function (){
            onBtnTaoDonClick();
        })

        // gán sự kiện ấn nút quay lại trên modal
        $("#btn-quay-lai").on("click", function(){
            onBtnQuayLaiClick();
        })

    /*** REGION 3 - Event handlers - Vùng khai báo các hàm xử lý sự kiện */
      
        // hàm xử lý sự kiện: tải trang
        function onPageLoading(){
            "use strict";
            // load dữ liệu danh sách drink vào mục chọn đồ uống
            loadDrinkListFromAPI();
        }

        // hàm sử lý sự kiện: ấn nút chọn combo pizza size S
        function onBtnSizeSClick() {
            "use strict";
            //gán giá trị các thuộc tính cho biến toàn cục gSelectedMenuStructure
            getDataFromMenuCombo("size S", "20 cm", "2", "200 g", "2", 150000);
            
            //set trạng thái của nut - set the buttons style 
            setMenuButtonsColor(gSelectedMenuStructure.menuName);
            // đẩy view đến vùng chọn loại Pizza (focus vào vùng đó) sau khi chọn
            $("#loaipizza")[0].scrollIntoView();
        }

        // hàm sử lý sự kiện: ấn nút chọn combo pizza size M
        function onBtnSizeMClick() {
            "use strict";
            //gán giá trị các thuộc tính cho biến toàn cục gSelectedMenuStructure
            getDataFromMenuCombo("size M", "25 cm", "4", "300 g", "3", 200000);
            
            //set trạng thái của nut - set the buttons style 
            setMenuButtonsColor(gSelectedMenuStructure.menuName);
            // đẩy view đến vùng chọn loại Pizza (focus vào vùng đó) sau khi chọn
            $("#loaipizza")[0].scrollIntoView();
        }

        // hàm sử lý sự kiện: ấn nút chọn combo pizza size L
        function onBtnSizeLClick() {
            "use strict";
            //gán giá trị các thuộc tính cho biến toàn cục gSelectedMenuStructure
            getDataFromMenuCombo("size L", "30 cm", "8", "500 g", "4", 250000);
            
            //set trạng thái của nut - set the buttons style 
            setMenuButtonsColor(gSelectedMenuStructure.menuName);
            // đẩy view đến vùng chọn loại Pizza (focus vào vùng đó) sau khi chọn
            $("#loaipizza")[0].scrollIntoView();
        }

        // hàm xử lý sự kiện: ấn nút chọn loại pizza Hawaii
        function onBtnHawaiiPizzaClick(){
            "use strict";
            gSelectedPizzaType.typeName = "Hawaii";
            // đổi màu nút khi chọn
            setTypePizzaButtonsColor(gSelectedPizzaType.typeName);
            // đẩy view tới mục chọn đồ uống
            $("#select-drink")[0].scrollIntoView();
        }

        // hàm xử lý sự kiện: ấn nút chọn loại pizza Seafood
        function onBtnSeafoodPizzaClick(){
            "use strict";
            gSelectedPizzaType.typeName = "Seafood";
            // đổi màu nút khi chọn
            setTypePizzaButtonsColor(gSelectedPizzaType.typeName);
            // đẩy view tới mục chọn đồ uống
            $("#select-drink")[0].scrollIntoView();
        }

        // hàm xử lý sự kiện: ấn nút chọn loại pizza Bacon
        function onBtnBaconPizzaClick(){
            "use strict";
            gSelectedPizzaType.typeName = "Bacon";
            // đổi màu nút khi chọn
            setTypePizzaButtonsColor(gSelectedPizzaType.typeName);
            // đẩy view tới mục chọn đồ uống
            $("#select-drink")[0].scrollIntoView();
        }

        // hàm xử lý sự kiện: ấn nút Gửi Đơn hàng
        function onBtnGuiDonHangClick(){
            "use strict";
            // b1: lấy dữ liệu trên form đơn hàng, lưu vào biến toàn cục
            getThongTinNguoiMua(gThongTinNguoiMua);
            // b2: validate dữ liệu
            var vIsValid = validateData(gThongTinNguoiMua);
            if (vIsValid){
                // b3: hiện form modal và hiển thị chi tiết thông tin đơn hàng
                showDataToModalForm(gThongTinNguoiMua);
            }
        }

        // hàm xử lý sự kiện: ấn nút Tạo đơn trên modal
        function onBtnTaoDonClick(){
            "use strict";
            // b0: khai báo đối tượng đơn hàng để gửi server
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
            }
            // b1: thu thập dữ liệu để gửi server
            thuThapDuLieuDonHang(vDonHangObject);
            // b2: gọi ajax api để gửi đơn hàng
            callJaxAPIToCreateOrders(vDonHangObject);
        }

        // hàm xử lý sự kiện: ấn nút Quay Lại trên modal
        function onBtnQuayLaiClick(){
            "use strict";
            $("#order-modal").modal("hide");
            $("#guidonhang")[0].scrollIntoView();
        }

    /*** REGION 4 - Common funtions - Vùng khai báo hàm dùng chung trong toàn bộ chương trình */

        // hàm gán giá trị các thuộc tính size pizza cho biến toàn cục
        function getDataFromMenuCombo(paramMenuName, paramDuongKinh, paramSuon, paramSalad, paramDrink, paramPriceVND ){
            "use strict";
            gSelectedMenuStructure.menuName = paramMenuName;
            gSelectedMenuStructure.duongKinh = paramDuongKinh;
            gSelectedMenuStructure.suon = paramSuon;
            gSelectedMenuStructure.salad = paramSalad;
            gSelectedMenuStructure.drink = paramDrink;
            gSelectedMenuStructure.priceVND = paramPriceVND;
        }

        // hàm đổi lại màu menu khi menu đó được chọn
        function setMenuButtonsColor(paramMenuNameSelected){
            "use strict";
            console.log("Combo được chọn: " + paramMenuNameSelected);
            if (paramMenuNameSelected == "size S"){
                $("#sizeS").removeClass("btn btn-orange w-100").addClass("btn btn-yellow w-100");
                $("#sizeM").removeClass("btn btn-yellow w-100").addClass("btn btn-orange w-100");
                $("#sizeL").removeClass("btn btn-yellow w-100").addClass("btn btn-orange w-100");
            }
            if (paramMenuNameSelected == "size M"){
                $("#sizeS").removeClass("btn btn-yellow w-100").addClass("btn btn-orange w-100");
                $("#sizeM").removeClass("btn btn-orange w-100").addClass("btn btn-yellow w-100");
                $("#sizeL").removeClass("btn btn-yellow w-100").addClass("btn btn-orange w-100");
            }
            if (paramMenuNameSelected == "size L"){
                $("#sizeS").removeClass("btn btn-yellow w-100").addClass("btn btn-orange w-100");
                $("#sizeM").removeClass("btn btn-yellow w-100").addClass("btn btn-orange w-100");
                $("#sizeL").removeClass("btn btn-orange w-100").addClass("btn btn-yellow w-100");
            }
        }

        // hàm đổi lại màu khi chọn loại Pizaa (Hawaii or Seafood or Bacon)
        function setTypePizzaButtonsColor(paramTypePizzaName){
            "use trict";
            console.log("Loại pizza được chọn: " + paramTypePizzaName);
            if (paramTypePizzaName == "Hawaii"){
                $("#select-hawaii").removeClass("btn btn-orange w-100").addClass("btn btn-yellow w-100");
                $("#select-seafood").removeClass("btn btn-yellow w-100").addClass("btn btn-orange w-100");
                $("#select-bacon").removeClass("btn btn-yellow w-100").addClass("btn btn-orange w-100");
            }
            if (paramTypePizzaName == "Seafood"){
                $("#select-hawaii").removeClass("btn btn-yellow w-100").addClass("btn btn-orange w-100");
                $("#select-seafood").removeClass("btn btn-orange w-100").addClass("btn btn-yellow w-100");
                $("#select-bacon").removeClass("btn btn-yellow w-100").addClass("btn btn-orange w-100");
            }
            if (paramTypePizzaName == "Bacon"){
                $("#select-hawaii").removeClass("btn btn-yellow w-100").addClass("btn btn-orange w-100");
                $("#select-seafood").removeClass("btn btn-yellow w-100").addClass("btn btn-orange w-100");
                $("#select-bacon").removeClass("btn btn-orange w-100").addClass("btn btn-yellow w-100");
            }
        }

        // hàm load dữ liệu danh sách drink vào mục chọn đồ uống
        function loadDrinkListFromAPI(){
            "use strict";
            $.ajax({
                url: "http://42.115.221.44:8080/devcamp-pizza365/drinks",
                type: "GET",
                dataType: 'json',
                success: function(Res){
                    gSelectDrinkType = Res;
                    handlerDrinkListToForm(Res);
                },
                error: function(Error){
                    alert(Error);
                }
            })
        }

        // hàm hiển thị danh sách đồ uống lấy từ server
        function handlerDrinkListToForm(paramResponseDrinkArr){
            "use strict";
            for (var bI = 0; bI < paramResponseDrinkArr.length; bI ++){
                $("#select-drink").append($("<option>", {
                    value: paramResponseDrinkArr[bI].maNuocUong,
                    text: paramResponseDrinkArr[bI].tenNuocUong
                }));
            }
        }

        // hàm lấy dữ liệu từ form thông tin người dùng
        function getThongTinNguoiMua(paramThongTinObj){
            "use strict";
            paramThongTinObj.menuName = gSelectedMenuStructure.menuName;
            paramThongTinObj.typeName = gSelectedPizzaType.typeName;
            paramThongTinObj.drink = $("#select-drink").val();
            paramThongTinObj.hoTen = $("#inp-ten").val().trim();
            paramThongTinObj.email = $("#inp-email").val().trim();
            paramThongTinObj.soDienThoai = $("#inp-dien-thoai").val().trim();
            paramThongTinObj.diaChi = $("#inp-dia-chi").val().trim();
            paramThongTinObj.voucherId = $("#inp-voucherId").val().trim();
            paramThongTinObj.loiNhan = $("#inp-loi-nhan").val().trim();
            paramThongTinObj.giamGia = (gSelectedMenuStructure.priceVND*paramThongTinObj.discount)/100;
            paramThongTinObj.thanhTien = gSelectedMenuStructure.priceVND - paramThongTinObj.giamGia;

            // kiểm tra mã voucher và lấy discount từ server (nếu mã đúng), tính giảm giá và thành tiền
            if (paramThongTinObj.voucherId != ""){
                $.ajax({
                    url: "http://42.115.221.44:8080/devcamp-voucher-api/voucher_detail/" + paramThongTinObj.voucherId,
                    type: "GET",
                    dataType: "json",
                    async: false,
                    success: function(Res){
                        paramThongTinObj.discount = Res.phanTramGiamGia;
                        paramThongTinObj.giamGia = (gSelectedMenuStructure.priceVND*paramThongTinObj.discount)/100;
                        paramThongTinObj.thanhTien = gSelectedMenuStructure.priceVND - paramThongTinObj.giamGia;
                    },
                    error: function(Error){
                        alert("Không tìm thấy voucher " + Error.responseText);
                        paramThongTinObj.voucherId = "";
                    }
                });

            }
        }

        // hàm kiểm tra lấy được từ form thông tin người dùng
        function validateData(paramThongTinObj){
            "use strict";
            if (paramThongTinObj.menuName == ""){
                alert("Bạn chưa chọn combo pizza");
                return false;
            }
            if (paramThongTinObj.typeName == ""){
                alert("Bạn chưa chọn loại pizza");
                return false;
            }
            if (paramThongTinObj.drink == "all"){
                alert("Bạn chưa chọn loại nước uống");
                return false;
            }

            if (paramThongTinObj.hoTen == ""){
                alert("Vui lòng nhập họ và tên !");
                return false;
            }
            if (paramThongTinObj.email == ""){
                alert("Vui lòng nhập email !");
                return false;
            }
            if (validateEmail(paramThongTinObj.email) == false){
                alert("Email nhập vào không hợp lệ!");
                return false;
            }
            if (paramThongTinObj.soDienThoai == ""){
                alert("Vui lòng nhập số điện thoại !");
                return false;
            }
            if (isNaN(paramThongTinObj.soDienThoai)){
                alert("Số điện thoại nhập vào không hợp lệ");
                return false;
            }
            if (paramThongTinObj.diaChi == ""){
                alert("Vui lòng nhập họ và tên !");
                return false;
            }
            return true;
        }

        // Hàm kiểm tra định dạng email
        function validateEmail(paramEmail) {
            "use strict";
            var vValidRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (paramEmail.match(vValidRegex)) {
                return true;
            } else {
                return false;
            }
        }

        // hàm show dữ liệu chi tiết lên modal form
        function showDataToModalForm(paramThongTinDonHangObj){
            "use strict";
            $("#order-modal").modal("show");

            $("#modal-ho-va-ten").val(paramThongTinDonHangObj.hoTen);
            $("#modal-so-dien-thoai").val(paramThongTinDonHangObj.soDienThoai);
            $("#modal-dia-chi").val(paramThongTinDonHangObj.diaChi);
            $("#modal-email").val(paramThongTinDonHangObj.email);
            $("#modal-loi-nhan").val(paramThongTinDonHangObj.loiNhan);
            $("#modal-voucherId").val(paramThongTinDonHangObj.voucherId);
            $("#modal-thong-tin-chi-tiet").val("Xác nhận: " +paramThongTinDonHangObj.hoTen + ", " + paramThongTinDonHangObj.soDienThoai + ", email: " + paramThongTinDonHangObj.email + ", địa chỉ: " + paramThongTinDonHangObj.diaChi + "\n"
                + "Menu: " + paramThongTinDonHangObj.menuName + ", sườn nướng: " + gSelectedMenuStructure.suon + ", salad: " + gSelectedMenuStructure.salad + ", số lượng nước: " + gSelectedMenuStructure.drink + ", loại nước: " + paramThongTinDonHangObj.drink + ",..." + "\n"
                + "Loại pizza: " + paramThongTinDonHangObj.typeName + ", Giá: " + gSelectedMenuStructure.priceVND + " vnd, Mã giảm giá: " + paramThongTinDonHangObj.voucherId + "\n"
                + "Giảm giá: " + paramThongTinDonHangObj.discount +"%, phải thanh toán: " + paramThongTinDonHangObj.thanhTien + " vnd.");
        }

        // hàm thu thập dữ liệu để gửi đến server
        function thuThapDuLieuDonHang(paramDonHangObj){
            "use strict";
            paramDonHangObj.kichCo = gThongTinNguoiMua.menuName;
            paramDonHangObj.duongKinh = gSelectedMenuStructure.duongKinh;
            paramDonHangObj.suon = gSelectedMenuStructure.suon;
            paramDonHangObj.salad = gSelectedMenuStructure.salad;
            paramDonHangObj.loaiPizza = gThongTinNguoiMua.typeName;
            paramDonHangObj.idVourcher = gThongTinNguoiMua.voucherId;
            paramDonHangObj.idLoaiNuocUong = gThongTinNguoiMua.drink;
            paramDonHangObj.soLuongNuoc = gSelectedMenuStructure.drink;
            paramDonHangObj.hoTen = gThongTinNguoiMua.hoTen;
            paramDonHangObj.thanhTien = gThongTinNguoiMua.thanhTien;
            paramDonHangObj.email = gThongTinNguoiMua.email;
            paramDonHangObj.soDienThoai = gThongTinNguoiMua.soDienThoai;
            paramDonHangObj.diaChi = gThongTinNguoiMua.diaChi;
            paramDonHangObj.loiNhan = gThongTinNguoiMua.loiNhan;
        }

        // hàm gọi server để gửi dữ liệu cần tạo đơn hàng
        function callJaxAPIToCreateOrders(paramDonHangObj){
            "use strict";
            var vDonHangDataString = JSON.stringify(paramDonHangObj);
            $.ajax({
                url: "http://42.115.221.44:8080/devcamp-pizza365/orders",
                type: "POST",
                data: vDonHangDataString,
                contentType: "application/json;charset=UTF-8",
                success: function(Response){
                    console.log(Response);
                    gOrderId = Response.orderId;
                    $("#order-modal").modal("hide");
                    $("#orderId-modal").modal("show");
                    $("#inp-orderId-modal").val(gOrderId);
                },
                error: function(AjaxContent){
                    alert(AjaxContent.responseText);
                }
            })
        }

});
