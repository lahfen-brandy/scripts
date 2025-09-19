// This contains 3 js scripts only
//use at random.

// Initial:

javascript:(function() {
    // Get all <script> elements in the document
    var scripts = document.getElementsByTagName('script'),
        // Regex to extract the value of the src attribute
        regex = /src=["']([^"']+)["']/i,
        // Array to store matched script URLs
        matches = [],
        i;

    // Loop through all scripts
    for (i = 0; i < scripts.length; i++) {
        try {
            // Extract the src URL from the script tag's outer HTML
            var src = scripts[i].outerHTML.match(regex);
            // If a src URL is found, add it to matches array
            if (src) matches.push(src[1]);
        } catch (e) {
            // Log any errors (in case some script tags are malformed)
            console.log("An error occurred: " + e);
        }
    }

    // Get the full HTML of the page and remove all <script> tags
    var newContent = document.documentElement.outerHTML.replace(
        /<script[\s\S]*?<\/script>/gi,
        ''
    );

    // For each script found, add a blank line in the document (optional visual spacing)
    matches.forEach(function() {
        document.write("<br>");
    });

    // Wait 300ms, then overwrite the page content with the script-free HTML
    setTimeout(function() {
        document.write(newContent);
    }, 300);
})();





// Logs all <script> src URLs to the console.

(function() {
    // Get all <script> elements
    var scripts = document.getElementsByTagName('script');
    var scriptSrcs = [];

    for (var i = 0; i < scripts.length; i++) {
        try {
            if (scripts[i].src) {
                scriptSrcs.push(scripts[i].src);
                // Optional: visually mark scripts
                scripts[i].style.border = "2px dashed red";
            }
        } catch (e) {
            console.log("Error reading script: " + e);
        }
    }

    console.log("Scripts found on this page:", scriptSrcs);

    // Hide script tags (won't break most pages)
    for (var j = 0; j < scripts.length; j++) {
        scripts[j].type = "text/disabled"; // disables the script
    }

    alert("All scripts are now disabled. Check console for script URLs.");
})();

// Advantages of this version:
// • Doesn’t destroy your page like document.write() does.
// • Lets you see which scripts exist and disables them for testing.
// • Works directly from the console or as a bookmarklet.






// shows inline scripts (not just src ones)

(function() {
    // Get all <script> elements
    var scripts = document.getElementsByTagName('script');
    var scriptDetails = [];

    for (var i = 0; i < scripts.length; i++) {
        try {
            if (scripts[i].src) {
                // External script file
                scriptDetails.push({
                    type: "external",
                    src: scripts[i].src
                });
            } else if (scripts[i].innerText.trim() !== "") {
                // Inline script (just show first 100 chars for preview)
                scriptDetails.push({
                    type: "inline",
                    code: scripts[i].innerText.trim().slice(0, 100) + 
                          (scripts[i].innerText.length > 100 ? "..." : "")
                });
            }
        } catch (e) {
            console.log("Error reading script: " + e);
        }
    }

    console.log("Scripts found on this page:", scriptDetails);

    // Disable scripts without deleting them
    for (var j = 0; j < scripts.length; j++) {
        scripts[j].type = "text/disabled"; // Prevents execution
    }

    alert("All scripts (inline + external) collected. Check console for details.");
})();
