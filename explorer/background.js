var status = "default";

function sendResponse(){ }

function updatedTab(tabId, changeInfo, tab)
{
    chrome.tabs.sendMessage(tabId, {status: "explore"});
}

function activatedTab(activeInfo)
{
    chrome.tabs.sendMessage(activeInfo.tabId, {status: "explore"});
}

function newTab(request, sender, sendResponse)
{
    chrome.tabs.create({
        windowId: sender.tab.windowId,
        index: sender.tab.index + 1,
        url: request.url,
        active: false
     });
}    

function activate()
{
    chrome.runtime.onMessage.addListener(newTab);
        
    chrome.tabs.query({active: true}, function(tabs){
        for(var n = 0; n < tabs.length; n++)
            if(tabs[n].status == "complete")
                chrome.tabs.sendMessage(tabs[n].id, {status: "explore"});
    });

    chrome.tabs.onActivated.addListener(activatedTab);
    chrome.tabs.onUpdated.addListener(updatedTab);

    chrome.browserAction.setIcon({
        path: "images/icon19_on.png"
    });

    status = "explore";
}

function deactivate()
{
    chrome.tabs.query({active: true}, function(tabs) {
        for(var m = 0; m < tabs.length; m++)
            chrome.tabs.sendMessage(tabs[m].id, {status: "default"});
    });

    chrome.runtime.onMessage.removeListener(newTab);
    chrome.tabs.onActivated.removeListener(activatedTab);
    chrome.tabs.onUpdated.removeListener(updatedTab);

    chrome.browserAction.setIcon({
        path: "images/icon19_off.png"
    });

    status = "default";
}

chrome.browserAction.onClicked.addListener(function() {
    if(status == "default")
        activate();
    else
        deactivate();
});

chrome.commands.onCommand.addListener(function(command) {
    if(command == "default-right-click-new-tab") {
        if(status == "default")
            activate();
        else
            deactivate();
    }
});
