// 0. 頁面載入後，呼叫 API ，並存入變數中
// 1. 頁面載入後，顯示下拉選單的選項。
// 2. 對按鈕進行監控，若觸發發選項就呼叫 API ，並印出結果
// 3. 將結果顯示到下方的 Content內
// 4. 做出分頁選項

// 0. 監聽頁面載入後，呼叫 API
// 1. 顯示下拉是選單的選項
window.addEventListener('load', API_Connect, false);

function API_Connect() {
    var API = 'http://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97';

    // 取 API 資料，並轉換資料型態為 Json
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            DataChange(this.responseText);
        }
        if(this.status == 400){
            alert('API呼叫錯誤'+this.status+','+this.readyState);
        }
    };
    xhttp.open("GET", API, true);
    xhttp.send();
};


/*
*
* 將 API 資料轉換成 JSON + 呼叫顯示『下拉是選單的選項』的function
*
*/
function DataChange(jsonData) {
    var jsonData = JSON.parse(jsonData);
    var result = jsonData.result.records;
    var dataLen = result.length;
    var kaoZone = [];

    // 將 API 的 Zone 丟入 kaoZone
    for(var i=0; i<dataLen; i++){
        kaoZone.push(result[i].Zone);
    };

    // 將陣列重複的值移除
    kaoZone = Array.from( new Set(kaoZone) );

    ShowArea(kaoZone);
    // 3.對下拉選單做監控，若選取地區就出發事件 ，將結果顯示到下方的 Content內
    document.addEventListener('change', function(){ShowResult(kaoZone, result)}, false);

    // 2.對按鈕進行監控，若觸發發選項就呼叫 API ，並印出結果
}

/*
* 顯示下拉是選單的選項
* kaoZone 存放API高雄所有區的資料(已處理)
* 將地區資料顯示在下拉式選單中
* 每次取一筆資料，就丟入陣列，並檢查陣列內的值，若相同不在丟入
*/
function ShowArea(kaoZone) {
    var Zone = document.querySelector('.area');
    var optionStr = '';

    // 印出 option 值(第一筆不可選 + 默認選第一筆)
    for(var j=0; j<kaoZone.length; j++){
        optionStr = document.createElement('option');
        optionStr.textContent = kaoZone[j];
        optionStr.setAttribute('value', kaoZone[j]);
        Zone.appendChild(optionStr);
    }
}


/*
* 顯示符合的結果在『content』底下
*
*
*/
function ShowResult(kaoZone, result) {
    // 對下拉選單進行監控，並取的選選擇的值
    var chooseResult = document.querySelector('.area');
    var clickAtrea = chooseResult.options[chooseResult.selectedIndex].text;
    // 更換分割線『地區』名稱
    AreaName(clickAtrea);
    ShowInfo(result, kaoZone, clickAtrea);
    // console.log(clickAtrea);
    // console.log(kaoZone);
    // console.log(result);


}

/*
* 更換分割線『地區』名稱
*/
function AreaName(clickAtrea) {
    document.querySelector('.areaName').textContent = clickAtrea;
}

/*
* 將結果顯示在content的區塊
*
*
*/
function ShowInfo(result, kaoZone, clickAtrea) {
    var innerContentStr = '';

    // 寫判斷式檢查取道的值是否存在在地區的陣列當中(雙重驗證比較安全
    for(var i=0; i<kaoZone.length; i++){
        if( clickAtrea == result[i].Zone){
            // console.log(result[i]);
            innerContentStr +=
                '<div class="areaMessage">'+
                '<div class="areaIMg">'+
                '<p class="sightseeingName">'+result[i].Name+'</p>'+
                '<p class="sightseeingAres">'+result[i].Zone+'</p>'+
                '</div>'+
                '<div class="areaInfo">'+
                '<ul><li><img src="../Images/icons_clock.png" alt="圖片不存在" class="iconsImg"><span class="sightseeingMsg">'+result[i].Opentime+'</span></li>'+
                '<li><img src="../Images/icons_pin.png" alt="圖片不存在" class="iconsImg"><span class="sightseeingAddr">'+result[i].Add+'</span></li>'+
                '<li><img src="../Images/icons_phone.png" alt="圖片不存在" class="iconsImg"><span class="sightseeingTel">'+result[i].Tel+'</span></li></ul>'+
                '<div class="areaFree">'+
                '<ul><li><img src="../Images/icons_tag.png" alt="圖片不存在" class="iconsImg"><span class="sightseeingTag">'+result[i].Ticketinfo+'</span></li></ul>'+
                '</div></div></div>';

            // 選取 innerContent 標籤 + 增加 html tag
            var innerContent = document.querySelector('.innerContent');
            innerContent.innerHTML = innerContentStr;
        }
    }

    var AreaIMg = document.querySelectorAll('.areaIMg');
    for(var j=0; j<AreaIMg.length; j++){
        AreaIMg[j].style.background = "url("+result[j].Picture1+") top center";
    }

}
