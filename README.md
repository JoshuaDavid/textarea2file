This extension allows you to edit the contents of a textarea in a separate editor.

Here is an example of usage on a minimal page with a textarea.


```html
<!DOCTYPE html>
<html>
    <head>
        <title>Textarea to File</title>
        <script>
var editor_app_id = 'bhchpeinaehepecndadpcfihocagmhcc';

window.addEventListener("DOMContentLoaded", function() {
    var textareas = document.getElementsByTagName('textarea');
    for(var i = 0; i < textareas.length; i++) {
        (function(i) {
            var textarea = textareas[i];
            var button = document.createElement('button');
            button.innerHTML = "Bind to a file";
            // Required to get them in the right order.
            document.body.insertBefore(button, textarea);
            document.body.insertBefore(textarea, button);
            button.title = "The contents of this textarea will be identical " +
                "to the contents of the file you select.\n" + 
                "If you change the file, the textarea will change.\n" + 
                "Likewise, if you change the textarea, the file will change."
            button.onclick = function() {
                console.log("clicked");
                var port = chrome.runtime.connect(editor_app_id);
                port.onMessage.addListener(function(message) {
                    console.log(message);
                    textarea.value = message.fulltext;
                });
            }
        })(i);
    }
});
        </script>
    </head>
    <body>
        <textarea rows="24" cols="80"></textarea>
    </body>
</html>
```

Note that this extension is nowhere near complete.
