"use strict";
    /*** REGION 1 - Global variables - Vùng khai báo biến, hằng số, tham số TOÀN CỤC */
    const gREQUEST_STATUS_OK = 200;
    const gREQUEST_CREATE_OK = 201; // status 201 là tạo mới thành công
    const gREQUEST_READY_STATUS_FINISH_AND_OK = 4;

    //base url
    const gBASE_URL = "http://42.115.221.44:8080/devcamp-pizza365/orders";

    const gEND_ROW_TABLE = -1;
    const gCOL_ORDER_ID = 0;
    const gCOL_KICH_CO_COMBO = 1;
    const gCOL_LOAI_PIZZA = 2;
    const gCOL_NUOC_UONG = 3;
    const gCOL_THANH_TIEN = 4;
    const gCOL_HO_VA_TEN = 5;
    const gCOL_SDT = 6;
    const gCOL_STATUS = 7;
    const gCOL_CHI_TIET = 8;
    

    // đối tượng lưu orderId
    var gOrderId = 0;

    /*** REGION 2 - Event Handler - Vùng xử lý sự kiện */
    // hàm tải trang
    function onPageLoading(){
        "use strict";
        // b1: get dữ liệu
        
        var vXmlHttp = new XMLHttpRequest();
        callApiGetAllOrder(vXmlHttp);
        vXmlHttp.onreadystatechange = function (){
            if (this.readyState == gREQUEST_READY_STATUS_FINISH_AND_OK && this.status == gREQUEST_STATUS_OK){
            // b2: hiển thị dữ liệu lên table
            console.log(vXmlHttp.responseText);
            handlerAllOrderToTable(vXmlHttp);
            }
        };
    }

    // hàm xử lý sự kiện ấn nút chi tiết
    function onBtnDetailOrderClick(paramDetailButton){
        var vGetId = paramDetailButton.dataset.id;
        var vGetOrderId = paramDetailButton.dataset.orderid;

         // gọi form OrderDetail.html
         var vUrlSiteOpen = "OrderDetail.html" + "?" 
            + "id=" + vGetId 
            + "&" + "orderid=" + vGetOrderId;
            window.location.href = vUrlSiteOpen;
    }

    /*** REGION 3 - Vùng khai báo hàm dùng chung */
    // gọi Api để lấy dữ liệu tất cả đơn hàng
    function callApiGetAllOrder(paramXmlHttp){
        paramXmlHttp.open("GET", gBASE_URL, true);
        paramXmlHttp.send();
    }

    // hàm hiển thị data order lấy được lên table
    function handlerAllOrderToTable(paramXmlHttp){
        var vTableArray = JSON.parse(paramXmlHttp.responseText);
        var vTableOrderElement = document.getElementById("order-table");
        var vOrderBodyTable = vTableOrderElement.getElementsByTagName("tbody")[0];
        for (var bI = 0; bI < vTableArray.length; bI ++){
            var bNewRow = vOrderBodyTable.insertRow(gEND_ROW_TABLE);

            var bOrderID = bNewRow.insertCell(gCOL_ORDER_ID);
            var bKichCoCombo = bNewRow.insertCell(gCOL_KICH_CO_COMBO);
            var bLoaiPizza = bNewRow.insertCell(gCOL_LOAI_PIZZA);
            var bNuocUong = bNewRow.insertCell(gCOL_NUOC_UONG);
            var bThanhTien = bNewRow.insertCell(gCOL_THANH_TIEN);
            var bHoVaTen = bNewRow.insertCell(gCOL_HO_VA_TEN);
            var bSDT = bNewRow.insertCell(gCOL_SDT);
            var bStatus = bNewRow.insertCell(gCOL_STATUS);
            var bChiTiet = bNewRow.insertCell(gCOL_CHI_TIET);
    
            
            bOrderID.innerHTML = vTableArray[bI].orderId;
            bKichCoCombo.innerHTML = vTableArray[bI].kichCo;
            bLoaiPizza.innerHTML = vTableArray[bI].loaiPizza;
            bNuocUong.innerHTML = vTableArray[bI].idLoaiNuocUong;
            bThanhTien.innerHTML = vTableArray[bI].thanhTien;
            bHoVaTen.innerHTML = vTableArray[bI].hoTen;
            bSDT.innerHTML = vTableArray[bI].soDienThoai;
            bStatus.innerHTML = vTableArray[bI].trangThai;

            // tạo ra nút chi tiết
            var bDetailButton = document.createElement("button");
            bDetailButton.innerHTML = "Chi tiết";
            bDetailButton.className= "btn btn-info";
            bChiTiet.appendChild(bDetailButton);
            // gắn id vào dataset cho button
            bDetailButton.setAttribute("data-id", vTableArray[bI].id);
            bDetailButton.setAttribute("data-orderid", vTableArray[bI].orderId);
            // gán hàm xử lý sự kiện ấn nút
            bDetailButton.addEventListener("click", function () {
                onBtnDetailOrderClick(this);
            } )
        }
    }