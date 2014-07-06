var current = "default";

function explore()
{   
    event.preventDefault();
    chrome.runtime.sendMessage({url: this.href});
}

function toggle(status)
{
    var links = document.getElementsByTagName("a");
    for(var x = 0; x < links.length; x++)
    {
        if(status == "explore")
            links[x].addEventListener("click", explore);
        else
            links[x].removeEventListener("click", explore);
    }
    current = status;
}

function sendResponse(){ }

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) { 
        if(current != request.status)
            toggle(request.status);
});
