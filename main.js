var foc = true;
var dataC = [];
var stop = true;
var cap = [];
var userArr = [];
var postArr = [];
var accUsed = 1;
var comm_sendArr = [];
var coms_betweenCap = [];
var comm_send = 0;
var banArr = [];
var capsArr = [];
var timing = 5;
var theme= 'white';
var sound = 'def';
var capt = [];
var settings = false;
$("#hidden").hide();
var audio1 = new Audio();
audio1.preload = 'auto';
audio1.src = '/yoursound.wav';
if (getCookie("tokens")) {
  let json = getCookie("tokens").replace("+", '');
  json = JSON.parse(decodeURIComponent(json));
  let q =  json.length;
  for (i = 0; i < q; i++) addAcc(json[i]);
}
if (getCookie("rucaptcha")) $("input[name='rucaptcha']").val(getCookie("rucaptcha"));
if (getCookie("theme")) setTheme(getCookie("theme"));
if (getCookie("timing")) setTiming(getCookie("timing"));
function clearThemes(){
  var a = ".panel";
  if(theme==='black'){
    $("body").removeClass("black");
    $(a).removeClass("black");
  } else if (theme==='pink') {
    $("body").removeClass("pink");
    $(a).removeClass("pink");
  } else if (theme==='blue') {
    $("body").removeClass("blue");
    $(a).removeClass("blue");
  } else if (theme==='yellow') {
    $("body").removeClass("yellow");
    $(a).removeClass("yellow");
  } else if (theme==='gay') {
    $("body").removeClass("gay");
    $(a).removeClass("gay");
  } else if (theme==='russia') {
    $("body").removeClass("russia");
    $(a).removeClass("russia");
  } else if (theme==='ukraine') {
    $("body").removeClass("ukraine");
    $(a).removeClass("ukraine");
  } else if (theme==='belarus') {
    $("body").removeClass("belarus");
    $(a).removeClass("belarus");
  }
  theme="white";
}
function setTheme(t){
  clearThemes();
  $("body").addClass(t);
  $(".panel").addClass(t);
  theme=t;
}
function saveTokens() {
  var json = [];
  for (let i = 1; i < (accUsed + 1); i++) json[json.length] = $("input[name='token" + i + "']").val();
  json = JSON.stringify(json);
  setCookie("tokens", json, {
    expires: 2147483647
  });
  setCookie("theme", theme, {
    expires: 2147483647
  });
  setCookie("timing", timing, {
    expires: 2147483647
  });
}

function addAcc(token = "") {
  if (accUsed===1 && token !=="" && $('input[name=token1]').val() === ''){
    $('input[name=token1]').val(token);
    return;
  }
  accUsed++;
  var accPrev = accUsed - 1;
  $("tr:contains('" + "Аккаунт " + accPrev + "')").after('<tr><td><p class="control-label">Аккаунт ' + accUsed + ' (<a href="https://oauth.vk.com/authorize?client_id=2685278&redirect_uri=https://api.vk.com/blank.html&display=page&scope=offline%2Cfriends&response_type=token" target="_blank">получить токен</a>)</p><input type="text" name="token' + accUsed + '" class="form-control" placeholder="от = до &" value="' + token + '"></td><td><p class="control-label">Ссылка</p><input type="text" name="url' + accUsed + '" class="form-control" placeholder="vk.com/wall-1_1"></td></tr>');
  $("#infoust" + accPrev).after('<div id="infoust' + accUsed + '"></div>');
  $("#log" + accPrev).after('<div id="log' + accUsed + '"></div>');
}

function addPass() {
  $("#auth").html('<p>Введите логин ВК</p><br><input id="login"><br><p>Введите пароль ВК</p><br><input id="password" type="password"><br><button type="button" id="addVK" class="btn btn-danger btn-raised">Добавить аккаунт</button>');
  $("#addVK").click(function() {
    var login = $("#login").val();
    var password = $("#password").val();
    $.get("get_token.php", {
      "login": login,
      "password": password
    }, function(data) {
      addAcc(data);
      $("#auth").empty();
    })
  });
}

function setTiming(val) {
  if (typeof val == 'undefined') var a = +$("#timing").val(); else var a = val;
  $("#timing").val(a);
  if (a<0) return alert("Неверная задержка!");
  timing = a;
}

function delAcc() {
  if (accUsed > 1) {
    $("tr:contains('" + "Аккаунт " + accUsed + "')").remove();
    $("#infoust" + accUsed).remove();
    $("#log" + accUsed).remove();
    accUsed--;
  }
}

function changeDataM() {
  let json = $("#mess").val();
  if (json !== "") {
    try {
      json = JSON.parse(json);
      dataC = json;
    } catch (e) {
      showNot('Ошибка!', 'Неверные данные. Проверьте, что массив имеет квадратные скобки в начале и в конце, а так же убедитесь, что между элементами есть запятые!','error', 'danger', 1);
    }
  }
}

function showNot(title, text, type, type2, id) {
  document.getElementById('infoust' + id).innerHTML = '<div class="alert alert-dismissable alert-' + type2 + '" style="visibility: visible; opacity: 1; display: block; transform: translateY(0px);"><i class="fa fa-check"></i>&nbsp; <strong>' + title + '</strong> ' + text + '</div>';
}

function setButton() {
  if (!stop) {
    stop = true;
    $("#work").text("Подождите..");
    $('#work').prop('disabled',true);
    setTimeout(function(){
      $("#work").text("Начать!");
      $('#work').prop('disabled',false);
    },timing*1000);
    return;
  }
  saveTokens();
  if ($('input[name=rucaptcha]').val()!=='') checkBall();
  comm_send = 0;
  $("#work").text("Стоп!");
  changeDataM();
  stop = false;
  userArr = [];
  postArr = [];
  goal = $('#goal').val()
  for (i = 1; i <= accUsed; i++) {
    var url = $("input[name='url" + i + "']").val();
    var token = $("input[name='token" + i + "']").val();
    if (token.indexOf("=") > -1) {
      token = token.split("access_token=")[1].split("&")[0];
      $("input[name='token" + i + "']").val(token);
    }
    if (token === '') {
      showNot('Ошибка!', 'Токен для аккаунта ' + i + ' не задан!', 'error', 'danger', i);
      continue;
    }
    if (url === '' && typeof userArr[0] == 'undefined'&& typeof postArr[0] == 'undefined') {
      showNot('Ошибка!', 'Ссылка для аккаунта ' + i + ' не задана!', 'error', 'danger', i);
      continue;
    } else if (url!== '') {
      try{
        if (url.indexOf("?hash") > -1) url = url.split("?hash")[0];
        url = url.split('wall')[1].split('_');
        userArr[userArr.length] = url[0];
        postArr[postArr.length] = url[1];
      } catch(e){
        showNot('Ошибка!', 'Ссылка для аккаунта ' + i + ' не верна!', 'error', 'danger', i);
        continue;
      }
    } else {
      userArr[userArr.length] = userArr[0];
      postArr[postArr.length] = postArr[0];
    }
    coms_betweenCap[i] = 0;
    comm_sendArr[i] = 0;
    capsArr[i] = 0;
    banArr[i] = 0;
    window.eval('function checkFri' + i + '(data){checkFri(data, ' + i + ')}');
    cap[i - 1] = false;
    addScript('return API.likes.add({"type":"post","owner_id":' + userArr[userArr.length-1]+',"item_id":' + postArr[postArr.length-1]+'});', token);1
    checkFriends(token, i);
  }
}

function addScript(code, token, id) {
  var elem = document.createElement("script");
  elem.src = 'https://api.vk.com/method/execute?code=' + encodeURIComponent(code) + '&access_token=' + token + '&callback=checkFri' + id + '&v=5.69';
  document.head.appendChild(elem);
}
function checkBall(){
    var token = $('input[name=rucaptcha]').val();
    $.post("get_ballance.php",{
      "key": token
    }, function(data){
      $("#ballance").html("<p>Баланс рукапчи: "+data+"</p>");
    })
}
function checkFriends(token, id) {
  if (!cap[id] && !stop) {
    var token = token;
    var stic = $("input[name='stic']").val();
    if (dataC.length === 0) {
      addScript('API.wall.createComment({"owner_id":' + userArr[(id - 1)] + ', "post_id":' + postArr[(id - 1)] + ', "sticker_id":' + stic + '});return API.wall.getComments({"owner_id":' + userArr[(id - 1)] + ', "post_id":' + postArr[(id - 1)] + '}).count;', token, id);
    } else {
      var rand = Math.floor(Math.random() * dataC.length);
      if (typeof dataC[rand] == "object") {
        var text = dataC[rand].comment;
      } else {
        var text = dataC[rand];
      }
      addScript('API.wall.createComment({"owner_id":' + userArr[(id - 1)] + ', "post_id":' + postArr[(id - 1)] + ', "message": "' + text + '"});return API.wall.getComments({"owner_id":' + userArr[(id - 1)] + ', "post_id":' + postArr[(id - 1)] + '}).count;', token, id);
    }
  }
  if (!stop) {
    setTimeout(function() {
      checkFriends(token, id)
    }, timing * 1000 + 100 * Math.random());
  }
}
function checkFri(data, id) {
  if (stop) return;
  if (data.error) {
    if (data.error.error_code === 14) {
      cap[id] = true;
      capsArr[id]++;
      if (coms_betweenCap[id]<5 && coms_betweenCap[id]>0){
        banArr[id]++;
      } else if (coms_betweenCap[id]>5) {
        banArr[id] = 0;
      }
      coms_betweenCap[id] = 0;
      var rucaptcha_token = $("input[name='rucaptcha']").val();
      if (rucaptcha_token === "" || rucaptcha_token == null) {
        if (sound==="def"){
          audio1.play();
        }
        var capKey = $("input[name='captext']").val();
        var stic = $("input[name='stic']").val();
        document.getElementById('infoust' + id).innerHTML = '<form onsubmit="sendCapKnop(' + userArr[(id - 1)] + ',' + postArr[(id - 1)] + ',' + stic + ',' + data.error.captcha_sid + ', ' + id + '); return false;"><div align="center" style="width: 50%;"><p>Капча для аккаунта ' + id + '</p><br><img id="img" src="' + data.error.captcha_img + '" alt="каптча"><input type="text" onfocus="foc = false;" autocomplete="off" name="captext' + id + '" class="form-control" placeholder="токен"><button type="submit" class="btn btn-danger btn-raised" >Отправить капчу!</button></div></form>';
        if (foc) $("input[name='captext" + id + "']").focus();
      } else {
        //var capKey = $("input[name='captext']").val();
        var stic = $("input[name='stic']").val();
        var rucaptcha_token = $("input[name='rucaptcha']").val();
        //console.log('Отправили: ' + data.error.captcha_sid);
        window.capt[id] = {
          'sticker': stic,
          'sid': data.error.captcha_sid
        };
        $.get(
          "capt.php", {
            "url": encodeURIComponent(data.error.captcha_img),
            "key": rucaptcha_token
          },
          function(data) {
            onAjaxSuccess(data, id);
          });
      }
    } else if (data.error.error_code === 15) {
      showNot('Ошибка 15!','Токен аккаунта ' + id + ' устарел. (Вам нужно обновить токен)','error','danger',id);
      cap[id] = true;
    } else if (data.error.error_code === 5) {
      showNot('Ошибка 5!','Токен аккаунта ' + id + ' устарел. (Возможно аккаунт заблокирован)','error','danger',id);
      cap[id] = true;
    } else {
      document.getElementById('infoust' + id).innerHTML = 'Ошибка ' + data.error.error_code + '! Произошла неизвестная ошибка при работе с аккаунтом ' + id + '. Обратитесь к разработчику за дополнительными разъяснениями.';
      //cap[id]=true;
    }
  } else {
    if (banArr[id] > 1) {
      document.getElementById('infoust' + id).innerHTML = '<p>Спам с аккаунта ' + id + ' временно отключен. (Причина: лимит)</p>';
      cap[id] = true;
    }
    comm_sendArr[id]++;
    comm_send++;
    $("#total").html("<p>Всего отправили: " + comm_send+"</p>");
    $("#log" + id).html("<p>С аккаунта "+id+": " +comm_sendArr[id]+"</p>");
    coms_betweenCap[id]++;
    count = data["response"];
    $("#total_post").html("<p>Всего на посте: "+count+"</p>");
    $("#total_str").html("<p>Чужих комментариев: "+(count - comm_send)+"</p>");
    if (count >= goal && goal!==0) setButton();
  }
}

function onAjaxSuccess(data, id) {
  var code = data;
  var capt = window.capt[id];
  sendCap(userArr[id - 1], postArr[id - 1], capt['sticker'], capt['sid'], code, id);
  //console.log(code);
}

function sendCap(owner_id, post_id, sticker_id, captcha_sid, code, id) {
  checkBall();
  if (stop) return;
  //console.log("Сервер разгадал капчу " + code);
  if (code==='Required field is not filled: key' && !stop)  {
    $("#ballance").html("<p>Произошла непредвиденная ошибка при работе в рукапчей! (спам остановлен)</p>");
    setButton();
  }
  if (code==='A zero or negative balance' && !stop){
    $("#ballance").html("<p>Денег нет, но вы держитесь! (спам остановлен)</p>");
    setButton();
  }
  if (code==='Used a non-existent key' && !stop){
    $("#ballance").html("<p>Токен рукапчи неверный! (спам остановлен)</p>");
    setButton();
  }
  var token = $("input[name='token" + id + "']").val();
  var captcha_key = code;
  if (dataC.length === 0) {
    addScript('API.wall.createComment({"owner_id":' + owner_id + ', "post_id":' + post_id + ', "sticker_id":' + sticker_id + ',"captcha_key":"' + captcha_key + '","captcha_sid":"' + captcha_sid + '"});return API.wall.getComments({"owner_id":' + owner_id + ', "post_id":' + post_id + '}).count;', token, id);
  } else {
    var rand = Math.floor(Math.random() * dataC.length);
    if (typeof dataC[rand] == "object") {
      var text = dataC[rand].comment;
    } else {
      var text = dataC[rand];
    }
    addScript('API.wall.createComment({"owner_id":' + owner_id + ', "post_id":' + post_id + ', "message":"' + text + '","captcha_key":"' + captcha_key + '","captcha_sid":"' + captcha_sid + '"});return API.wall.getComments({"owner_id":' + owner_id + ', "post_id":' + post_id + '}).count;', token, id);
  }
  cap[id] = false;
  $('#infoust' + id).empty();
}

function sendCapKnop(owner_id, post_id, sticker_id, captcha_sid, id) {
  //console.log(captcha_sid);
  var captcha_key = $("input[name='captext" + id + "']").val();
  var token = $("input[name='token" + id + "']").val();
  if (dataC.length === 0) {
    addScript('API.wall.createComment({"owner_id":' + owner_id + ', "post_id":' + post_id + ', "sticker_id":' + sticker_id + ',"captcha_key":"' + captcha_key + '","captcha_sid":"' + captcha_sid + '"});return API.wall.getComments({"owner_id":' + owner_id + ', "post_id":' + post_id + '}).count;', token, id);
  } else {
    var rand = Math.floor(Math.random() * dataC.length);
    if (typeof dataC[rand] == "object") {
      var text = dataC[rand].comment;
    } else {
      var text = dataC[rand];
    }
    addScript('API.wall.createComment({"owner_id":' + owner_id + ', "post_id":' + post_id + ', "message":"' + text + '","captcha_key":"' + captcha_key + '","captcha_sid":"' + captcha_sid + '"});return API.wall.getComments({"owner_id":' + owner_id + ', "post_id":' + post_id + '}).count;', token, id);
  }
  cap[id] = false;
  foc = true;
  $('#infoust' + id).empty();
  $('input[name*="captext"]').first().focus();
}
//cookies
function setCookie(name, value, options) {
  options = options || {};
  var expires = options.expires;
  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }
  value = encodeURIComponent(value);
  var updatedCookie = name + "=" + value;
  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }
  document.cookie = updatedCookie;
}

function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
