// 0. 頁面載入後，呼叫 API ，並存入變數中
// 1. 頁面載入後，顯示下拉選單的選項。
// 2. 對按鈕進行監控，若觸發發選項就呼叫 API ，並印出結果
// 3. 將結果顯示到下方的 Content內
// 4. 做出分頁選項

// 0. 監聽頁面載入後，呼叫 API
// 1. 顯示下拉是選單的選項
window.addEventListener('load', APIConnect, false);

function APIConnect() {
    var API = 'https://raw.githubusercontent.com/neil605164/JS_Kaohsiung_Travel/master/JSON/data.json';

    // 取 API 資料，並轉換資料型態為 Json
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var ishttps = 'https:' == document.location.protocol ? true: false;
            DataChange(this.responseText);
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

    // 顯示下拉選單值
    ShowArea(kaoZone);

    // 3.對下拉選單做監控，若選取地區就出發事件 ，將結果顯示到下方的 Content內
    var areaSelect = document.querySelector('.area');
    areaSelect.addEventListener('change', function(){ShowResult(kaoZone, result)}, false);

    // 2.對按鈕進行監控，若觸發發選項就呼叫 API ，並印出結果
    var headerBtn1 = document.querySelector('.headerBtn1');
    headerBtn1.addEventListener('click', function(){ShowInfo(result, kaoZone, headerBtn1.value)}, false);
    var headerBtn2 = document.querySelector('.headerBtn2');
    headerBtn2.addEventListener('click', function(){ShowInfo(result, kaoZone, headerBtn2.value)}, false);
    var headerBtn3 = document.querySelector('.headerBtn3');
    headerBtn3.addEventListener('click', function(){ShowInfo(result, kaoZone, headerBtn3.value)}, false);
    var headerBtn4 = document.querySelector('.headerBtn4');
    headerBtn4.addEventListener('click', function(){ShowInfo(result, kaoZone, headerBtn4.value)}, false);
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
*/
function ShowResult(kaoZone, result) {
    // 對下拉選單進行監控，並取的選選擇的值
    var chooseResult = document.querySelector('.area');
    var clickAtrea = chooseResult.options[chooseResult.selectedIndex].text;

    // 呼叫結果並顯示
    ShowInfo(result, kaoZone, clickAtrea);
}

/*
* 更換分割線『地區』名稱
*/
function AreaName(value) {
    document.querySelector('.areaName').textContent = value;
}

/*
* 將結果顯示在content的區塊
*/
function ShowInfo(result, kaoZone, value) {
    var innerContentStr = '';
    var matchResult = [];

    // 更換分割線『地區』名稱
    AreaName(value);

    // 檢查選取的值，是否存在於 result 的 data 中，若存在就將該筆資料丟入陣列
    for(var i=0; i<result.length; i++){
        if( value == result[i].Zone){
            matchResult.push(result[i]);
        }
    }

    // 印出相符合的資料結果
    for(var j=0; j<matchResult.length; j++){
        innerContentStr +=
            '<div class="areaMessage">'+
            '<div class="areaIMg">'+
            '<p class="sightseeingName">'+matchResult[j].Name+'</p>'+
            '<p class="sightseeingAres">'+matchResult[j].Zone+'</p>'+
            '</div>'+
            '<div class="areaInfo">'+
            '<ul><li><img src="../Images/icons_clock.png" alt="圖片不存在" class="iconsImg"><span class="sightseeingMsg">'+matchResult[j].Opentime+'</span></li>'+
            '<li><img src="../Images/icons_pin.png" alt="圖片不存在" class="iconsImg"><span class="sightseeingAddr">'+matchResult[j].Add+'</span></li>'+
            '<li><img src="../Images/icons_phone.png" alt="圖片不存在" class="iconsImg"><span class="sightseeingTel">'+matchResult[j].Tel+'</span></li></ul>'+
            '<div class="areaFree">'+
            '<ul><li><img src="../Images/icons_tag.png" alt="圖片不存在" class="iconsImg"><span class="sightseeingTag">'+matchResult[j].Ticketinfo+'</span></li></ul>'+
            '</div></div></div>';

        // 選取 innerContent 標籤 + 增加 html tag
        var innerContent = document.querySelector('.innerContent');
        innerContent.innerHTML = innerContentStr;
    }

    var AreaIMg = document.querySelectorAll('.areaIMg');
    for(var k=0; k<AreaIMg.length; k++){
        AreaIMg[k].style.background = "url("+matchResult[k].Picture1+") top center";
        AreaIMg[k].style.backgroundSize = "cover";
    }

}
