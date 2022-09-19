    "use strict";
        $(document).ready(function() {
        /*** REGION 1 - Global variables - Vùng khai báo biến, hằng số, tham số TOÀN CỤC */
            var gId;
            var gOrderId;    

            var gDataOrders = []; // khai báo mảng chứa dữ liệu đơn hàng
            const gORDER = ["orderId", "kichCo", "loaiPizza", "idLoaiNuocUong", "thanhTien", "hoTen", "soDienThoai", "trangThai", "action"];
            // khai báo các cột của datatable
            const gCOLUMN_ORDER_ID = 0;
            const gCOLUMN_KICH_CO = 1;
            const gCOLUMN_LOAI_PIZZA = 2;
            const gCOLUMN_ID_LOAI_NUOC_UONG = 3;
            const gCOLUMN_THANH_TIEN = 4;
            const gCOLUMN_HO_TEN = 5;
            const gCOLUMN_SO_DIEN_THOAI = 6;
            const gCOLUMN_TRANG_THAI = 7;
            const gCOLUMN_ACTION = 8;

            // định nghĩa table - chưa có data
            $("#order-table").DataTable({
                "columns": [
                    { "data": gORDER[gCOLUMN_ORDER_ID]},
                    { "data": gORDER[gCOLUMN_KICH_CO]},
                    { "data": gORDER[gCOLUMN_LOAI_PIZZA]},
                    { "data": gORDER[gCOLUMN_ID_LOAI_NUOC_UONG]},
                    { "data": gORDER[gCOLUMN_THANH_TIEN]},
                    { "data": gORDER[gCOLUMN_HO_TEN]},
                    { "data": gORDER[gCOLUMN_SO_DIEN_THOAI]},
                    { "data": gORDER[gCOLUMN_TRANG_THAI]},
                    { "data": gORDER[gCOLUMN_ACTION]}
                ],
                "columnDefs": [
                    {
                        "targets": gCOLUMN_ACTION,
                        "defaultContent": "<button class='btn btn-primary btn-detail'>Chi tiết</button>"
                    }
                ]
            });

        /*** REGION 2 - Vùng gán / thực thi hàm xử lý sự kiện cho các elements */

            // gọi hàm thực thi việc tải trang
            onPageLoading();

            // gán sự kiện cho nút chi tiết
            $("#order-table").on("click", ".btn-detail", function(){
                onBtnDetailClick(this); // this chỉ là button được ấn
            });
            
            // gán sự kiện cho nút Lọc
            $("#btn-filter").on("click", function(){
                onBtnFilterDataClick();
            });

            // gán sự kiện cho nút confirm (trên modal)
            $("#btn-confirm").on("click", function(){
                onBtnConfirmClick();
            });

            // gán sự kiện cho nút confirm (trên modal)
            $("#btn-cancel").on("click", function(){
                onBtnCancelClick();
            });

        /*** REGION 3 - Event handlers - Vùng khai báo các hàm xử lý sự kiện */

            // hàm tải trang
            function onPageLoading(){
                "use strict";
                // lấy data từ server
                $.ajax({
                    url: "http://42.115.221.44:8080/devcamp-pizza365/orders",
                    type: "GET",
                    dataType: "json",
                    success: function(Response){
                        gDataOrders = Response;
                        console.log(gDataOrders);
                        // gọi hàm load dữ liệu lấy được vào bảng
                        loadDataToTable(gDataOrders);
                    },
                    error: function(Error){
                        console.assert(Error.responseText);
                    }
                });
            }

            // hàm xử lý khi ấn nút Chi tiết
            function onBtnDetailClick(paramDetailButton){
                "use strict";
                var vRowSelected = $(paramDetailButton).closest("tr");
                var vTable = $("#order-table").DataTable();
                var vDataRow = vTable.row(vRowSelected).data();
                gId = vDataRow.id;
                gOrderId = vDataRow.orderId;
                

                getAjaxDetailOrder(gOrderId);
                $("#order-modal").modal("show");
            }

            // hàm xử lý khi ấn nút Lọc
            function onBtnFilterDataClick(){
                "use strict";
                var vStatus = $("#select-trang-thai").val();
                var vPizzaType = $("#select-loai-pizza").val();
                console.log(vStatus);
                console.log(vPizzaType);
                var vDataFilter = gDataOrders.filter(function(paramOrder){
                    return (paramOrder.loaiPizza == vPizzaType.toUpperCase() || vPizzaType == "all" ) && (paramOrder.trangThai == vStatus || vStatus == "all")
                });
                console.log(vDataFilter);
                // gọi lại hàm load data vừa được lọc
                loadDataToTable(vDataFilter);
            }

            // hàm xử lý khi ấn nút Confirm trên modal
            function onBtnConfirmClick(){
                "use strict";
                console.log("ID: " + gId);
                // b0: khai báo đối tượng lưu dữ liệu trên form
                var vConfirmDataObj = {
                    orderId: "",
                    kichCo: "",
                    duongKinh: "",
                    suon: "",
                    idLoaiNuocUong: "",
                    soLuongNuoc: "",
                    idVourcher: "",
                    loaiPizza: "",
                    salad: "",
                    thanhTien: "",
                    giamGia: "",
                    hoTen: "",
                    email: "",
                    soDienThoai: "",
                    diaChi: "",
                    loiNhan: "",
                    trangThai: "",
                    ngayTao: "",
                    ngayCapNhat: ""
                };
                // b1: thu thập dữ liệu được sửa trên form modal
                getDataModalForm(vConfirmDataObj);
                // b2: validate dữ liệu
                var vIsvalidate = validateData(vConfirmDataObj);
                if (vIsvalidate){
                    // b3: call server để cập nhật dữ liệu
                    callAjaxAPI(vConfirmDataObj);
                }
            }

            // hàm xử lý khi nút Cancel trên form modal được ấn
            function onBtnCancelClick(){
                "use strict";
                console.log("ID được xác định trạng thái cancel: " + gId);
                // b0: khai báo đối tượng chứa dữ liệu cần cancel
                var vCancelDataObj = {
                    trangThai: ""
                }
                // b1: lấy dữ liệu của đơn hàng cần cancel
                vCancelDataObj.trangThai = "cancel";
                // b2: validate ( không cần)
                // b3: gọi server để cập nhật (cancel) đơn hàng
                callAjaxAPI(vCancelDataObj);
            }

        /*** REGION 4 - Common funtions - Vùng khai báo hàm dùng chung trong toàn bộ chương trình */

            // hàm load dữ liệu lấy được lên table
            function loadDataToTable(paramResponseObject){
                "use strict";
                var vOrderTable = $("#order-table").DataTable()
                // xóa toàn bộ dữ liệu đang có của bảng
                vOrderTable.clear();
                // cập nhật data cho bảng
                vOrderTable.rows.add(paramResponseObject);
                // cập nhật lại giao diện hiển thị bảng
                vOrderTable.draw();
            }

            // hàm gọi api theo order Id
            function getAjaxDetailOrder(paramOrderId){
                "use strict";
                $.ajax({
                    url: "http://42.115.221.44:8080/devcamp-pizza365/orders/" + paramOrderId,
                    type: "GET",
                    dataType: "json",
                    success: function(paramRes){
                        handlerOrderDetail(paramRes);
                        console.log(paramRes);
                    },
                    error: function(ajaxContent){
                        alert(ajaxContent.responseText);
                    }
                });
            }

            // load dữ liệu lên form modal
            function handlerOrderDetail(paramResponseObject){
                "use strict";
                $("#inp-orderID").val(paramResponseObject.orderId);
                $("#inp-kich-co-combo").val(paramResponseObject.kichCo);
                $("#inp-duong-kinh-pizza").val(paramResponseObject.duongKinh);
                $("#inp-suon-nuong").val(paramResponseObject.suon);
                $("#inp-do-uong").val(paramResponseObject.idLoaiNuocUong);
                $("#inp-so-luong-nuoc-uong").val(paramResponseObject.soLuongNuoc);
                $("#inp-voucherId").val(paramResponseObject.idVourcher);
                $("#inp-loai-pizza").val(paramResponseObject.loaiPizza);
                $("#inp-salad").val(paramResponseObject.salad);
                $("#inp-thanh-tien").val(paramResponseObject.thanhTien);
                $("#inp-discount").val(paramResponseObject.giamGia);
                $("#inp-ho-va-ten").val(paramResponseObject.hoTen);
                $("#inp-email").val(paramResponseObject.email);
                $("#inp-so-dien-thoai").val(paramResponseObject.soDienThoai);
                $("#inp-dia-chi").val(paramResponseObject.diaChi);
                $("#inp-loi-nhan").val(paramResponseObject.loiNhan);
                $("#inp-trang-thai").val(paramResponseObject.trangThai);
                $("#inp-ngay-tao-don").val(paramResponseObject.ngayTao);
                $("#inp-ngay-cap-nhat").val(paramResponseObject.ngayCapNhat);
            }
            
            // hàm thu thập dữ liệu trên form modal
            function getDataModalForm(paramConfirmDataObj){
                "use strict";
                paramConfirmDataObj.orderId = $("#inp-orderID").val().trim();
                paramConfirmDataObj.kichCo = $("#inp-kich-co-combo").val().trim();
                paramConfirmDataObj.duongKinh = $("#inp-duong-kinh-pizza").val().trim();
                paramConfirmDataObj.suon = $("#inp-suon-nuong").val().trim();
                paramConfirmDataObj.idLoaiNuocUong = $("#inp-do-uong").val().trim();
                paramConfirmDataObj.soLuongNuoc = $("#inp-so-luong-nuoc-uong").val().trim();
                paramConfirmDataObj.idVourcher = $("#inp-voucherId").val().trim();
                paramConfirmDataObj.loaiPizza = $("#inp-loai-pizza").val().trim();
                paramConfirmDataObj.salad = $("#inp-salad").val().trim();
                paramConfirmDataObj.thanhTien = $("#inp-thanh-tien").val().trim();
                paramConfirmDataObj.giamGia = $("#inp-discount").val().trim();
                paramConfirmDataObj.hoTen = $("#inp-ho-va-ten").val().trim();
                paramConfirmDataObj.email = $("#inp-email").val().trim();
                paramConfirmDataObj.soDienThoai = $("#inp-so-dien-thoai").val().trim();
                paramConfirmDataObj.diaChi = $("#inp-dia-chi").val().trim();
                paramConfirmDataObj.loiNhan = $("#inp-loi-nhan").val().trim();
                paramConfirmDataObj.trangThai = "comfirmed";
                paramConfirmDataObj.ngayTao = $("#inp-ngay-tao-don").val().trim();
                paramConfirmDataObj.ngayCapNhat = $("#inp-ngay-cap-nhat").val().trim();
            
            }

            // hàm kiểm tra dữ liệu form modal
            function validateData(paramConfirmDataObj){
                "use strict";
                if (paramConfirmDataObj.orderId == ""){
                    alert("Bạn cần nhập orderId");
                    return false;
                }
                if (paramConfirmDataObj.kichCo == ""){
                    alert("Bạn cần nhập kích cỡ Combo (VD: S, M, L)");
                    return false;
                }
                if (paramConfirmDataObj.duongKinh == ""){
                    alert("Bạn cần nhập đường kính Pizza (VD: 20, 25, 30)");
                    return false;
                }
                if (paramConfirmDataObj.suon == ""){
                    alert("Bạn cần nhập số lượng sườn nướng");
                    return false;
                }
                if (paramConfirmDataObj.idLoaiNuocUong == ""){
                    alert("Bạn cần nhập loại đồ uống");
                    return false;
                }
                if (paramConfirmDataObj.soLuongNuoc == ""){
                    alert("Bạn cần nhập số lượng nước");
                    return false;
                }
                if (paramConfirmDataObj.idVourcher == ""){
                    alert("Bạn cần nhập voucher Id");
                    return false;
                }
                if (paramConfirmDataObj.loaiPizza == ""){
                    alert("Bạn cần nhập loại Pizza ");
                    return false;
                }
                if (paramConfirmDataObj.salad == ""){
                    alert("Bạn cần nhập salad (g)");
                    return false;
                }
                if (paramConfirmDataObj.thanhTien == ""){
                    alert("Bạn cần nhập thành tiền là bao nhiêu");
                    return false;
                }
                if (paramConfirmDataObj.giamGia == ""){
                    alert("Bạn cần nhập giám giá bao nhiêu (%)");
                    return false;
                }
                if (paramConfirmDataObj.hoTen == ""){
                    alert("Bạn cần nhập họ và tên");
                    return false;
                }
                if (paramConfirmDataObj.email == ""){
                    alert("Bạn cần nhập email");
                    return false;
                }
                if (validateEmail(paramConfirmDataObj.email) == false){
                    alert("Email nhập vào không hợp lệ!");
                    return false;
                }
                if (paramConfirmDataObj.soDienThoai == ""){
                    alert("Bạn cần nhập số điện thoại");
                    return false;
                }
                if (paramConfirmDataObj.diaChi == ""){
                    alert("Bạn cần nhập địa chỉ");
                    return false;
                }
                if (paramConfirmDataObj.ngayTao == ""){
                    alert("Bạn cần nhập ngày tạo");
                    return false;
                }
                if (paramConfirmDataObj.ngayCapNhat == ""){
                    alert("Bạn cần nhập ngày cập nhật");
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
                } 
                else {
                    return false;
                }
            }

            // hàm gọi server để confirm (update) đơn hàng dựa vào Id
            function callAjaxAPI(paramConfirmDataObj){
                "use strict";
                var vDataString = JSON.stringify(paramConfirmDataObj);
                $.ajax({
                    url: "http://42.115.221.44:8080/devcamp-pizza365/orders/" + gId,
                    type: "PUT",
                    contentType: "application/json;charset=UTF-8",
                    data: vDataString,
                    success: function(response){
                        alert("Đã cập nhật thành công dữ liệu đơn hàng này!");
                        onPageLoading();
                    },
                    error: function(ajaxContent){
                        alert(ajaxContent.responseText);
                    }
                })
            }

        });