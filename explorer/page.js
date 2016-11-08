var URL = 'https://brutbio.com/';
var TOKEN = 'token';

/* 
 *
 */
chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab){
          console.log("activated tab.url through page.js: " + tab.url);

          chrome.cookies.get({'url': URL, 'name': TOKEN}, function(cookie) {
            if(cookie) {
              var xhttp = new XMLHttpRequest();
              xhttp.open("POST", URL.concat("browser/history"), true);

              xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
              xhttp.setRequestHeader("Authorization", "Basic " + cookie.value);

              var params = "timestamp= " + Date.now() + "&action=activated&url=" + encodeURIComponent(tab.url);
              xhttp.send(params);
            }
            else {
              console.log("no cookie found!");
              console.log("pls sign in to <a href='https://brutbio.com/login'>brutbio.com/login</a>");
            }
          });
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if(changeInfo.status == "loading") {
    console.log(changeInfo.url);
    console.log(tab.url);
    chrome.cookies.get({'url': URL, 'name': TOKEN}, function(cookie) {
      if(cookie) {
        var xhttp = new XMLHttpRequest();              
        xhttp.open("POST", URL.concat("browser/history"), true);

        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.setRequestHeader("Authorization", "Basic " + cookie.value);

        var params = "timestamp= " + Date.now() + "&url=" + encodeURIComponent(tab.url);
        if(tab.active) {
          params = params.concat("&action=updated");
        }
        else {
          params = params.concat("&action=opened");
        }
        xhttp.send(params); 
      }
      else {
        console.log("no cookie found!");
        console.log("pls sign in to <a href='https://brutbio.com/login'>brutbio.com/login</a>");
      }
    });
  }
});
