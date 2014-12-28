// Run our kitten generation script as soon as the document's DOM is ready.

var lastEntry = null;
var lastFile = null;
var _port;

chrome.runtime.onConnectExternal.addListener(function(port) {
    _port = port;
    // We need a foreground page because we can't use the chrome.fileSystem
    // API in a background page. However, we don't actually want a popup, so
    // we will immediately hide it. It's a very inelegant solution, but good
    // enough for now.
    chrome.app.window.create('popup.html', function(popup) {
        popup.hide();

        var fileSystem = popup.contentWindow.chrome.fileSystem;
        var reader     = new FileReader();

        var currentEntry = null;
        var currentText  = "";

        function updateCurrentText() {
            if(currentEntry == null) {
                // There is currently no entry.
            } else {
                currentEntry.file(function(file) {
                    reader.readAsText(file);
                })
                reader.onloadend = function() {
                    var oldText = currentText;
                    currentText = reader.result;
                    if(currentText != oldText) {
                        port.postMessage({
                            fulltext: currentText
                        });
                    }
                }
            }
        }

        fileSystem.chooseEntry({type: 'openWritableFile'}, function(entry) {
            currentEntry = entry;
            updateCurrentText();
            setInterval(updateCurrentText, 200);
        });

        port.onMessage.addListener(function(message) {
            port.postMessage(currentText);
        });

        port.onDisconnect.addListener(function() {
            popup.close();
        });

    });
});
