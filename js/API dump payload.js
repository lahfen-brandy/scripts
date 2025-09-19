// There are a total of 10 different js snippets here, use them cronologically to study the output clearly


// Monkey-patch fetch and XMLHttpRequest.
// This lets you log every API call the page makes (including endpoints used to fetch user data).

(function() {
    // Patch fetch
    const origFetch = window.fetch;
    window.fetch = async (...args) => {
        console.log("Fetch called:", args[0]);
        return origFetch.apply(this, args);
    };

    // Patch XMLHttpRequest
    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        console.log("XHR called:", method, url);
        return origOpen.apply(this, [method, url, ...rest]);
    };

    alert("logging all API endpoints (fetch/XHR) to the console.");
})();





// Filtering for “likely user-data” APIs
// This part is trickier, but you can add heuristics. For example, you can filter by:
// • Endpoints containing /api/, /user/, /profile/, /account/, /data/.
// • Endpoints that return JSON containing fields like email, id, token, username.

(function() {
    function looksSensitive(url, body) {
        const keywords = ["user", "account", "profile", "email", "token", "id"];
        return keywords.some(k => url.toLowerCase().includes(k) || (body && body.includes(k)));
    }

    // Fetch hook
    const origFetch = window.fetch;
    window.fetch = async (...args) => {
        const [url, options] = args;
        if (looksSensitive(url, options?.body)) {
            console.warn("Potential user-data API (fetch):", url, options);
        }
        return origFetch.apply(this, args);
    };

    // XHR hook
    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        if (looksSensitive(url)) {
            console.warn("Potential user-data API (XHR):", method, url);
        }
        return origOpen.apply(this, [method, url, ...rest]);
    };

    alert("monitoring API endpoints. Check console for possible sensitive ones.");
})();





// this is an extended snippet that will log API endpoints (fetch + XHR) and their response bodies.
// It also tries to highlight ones that might contain sensitive fields like email, token, username, id, etc.

(function() {
    function looksSensitive(text) {
        if (!text) return false;
        const keywords = ["user", "account", "profile", "email", "token", "id", "name"];
        return keywords.some(k => text.toLowerCase().includes(k));
    }

    // --- Patch fetch ---
    const origFetch = window.fetch;
    window.fetch = async (...args) => {
        const [url, options] = args;
        try {
            const response = await origFetch.apply(this, args);
            const clone = response.clone(); // used clone so that body isn't consumed
            clone.text().then(body => {
                if (looksSensitive(url) || looksSensitive(body)) {
                    console.warn("🔎 Potential sensitive API (fetch):", url);
                    console.log("➡️ Request options:", options);
                    console.log("⬅️ Response body:", body);
                } else {
                    console.log("Fetch:", url);
                }
            });
            return response;
        } catch (e) {
            console.error("Fetch error:", e);
            throw e;
        }
    };

    // --- Patch XHR ---
    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this._url = url;
        return origOpen.apply(this, [method, url, ...rest]);
    };

    XMLHttpRequest.prototype.send = function(body) {
        this.addEventListener("load", function() {
            try {
                const resp = this.responseText;
                if (looksSensitive(this._url) || looksSensitive(resp)) {
                    console.warn("🔎 Potential sensitive API (XHR):", this._url);
                    console.log("➡️ Request body:", body);
                    console.log("⬅️ Response body:", resp);
                } else {
                    console.log("XHR:", this._url);
                }
            } catch (e) {
                console.error("XHR log error:", e);
            }
        });
        return origSend.apply(this, arguments);
    };

    alert("Now logging API requests + responses. Check console for sensitive ones.");
})();





// a lighter version of the snippet. Instead of dumping full request/response bodies (which can get messy), it will simply log:
// • API URL
// • HTTP method
// • Status code
// And mark ones that might be sensitive (based on keywords).

(function() {
    function looksSensitive(text) {
        if (!text) return false;
        const keywords = ["user", "account", "profile", "email", "token", "id", "auth"];
        return keywords.some(k => text.toLowerCase().includes(k));
    }

    // --- Patch fetch ---
    const origFetch = window.fetch;
    window.fetch = async (...args) => {
        const [url, options] = args;
        const method = (options && options.method) || "GET";
        try {
            const response = await origFetch.apply(this, args);
            const label = looksSensitive(url) ? "🔎 Sensitive?" : "➡️";
            console.log(`${label} Fetch [${method}] ${url} → ${response.status}`);
            return response;
        } catch (e) {
            console.error("Fetch error:", e);
            throw e;
        }
    };

    // --- Patch XHR ---
    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this._url = url;
        this._method = method;
        return origOpen.apply(this, [method, url, ...rest]);
    };

    XMLHttpRequest.prototype.send = function(body) {
        this.addEventListener("load", function() {
            const label = looksSensitive(this._url) ? "🔎 Sensitive?" : "➡️";
            console.log(`${label} XHR [${this._method}] ${this._url} → ${this.status}`);
        });
        return origSend.apply(this, arguments);
    };

    alert("Now logging API URLs + status codes. Check console for suspicious endpoints.");
})();





// this is a click-to-expand version.
// It logs the method, URL, and status code in the console. Each log is expandable so you can inspect request/response details only when needed (cleaner output).

(function() {
    function looksSensitive(text) {
        if (!text) return false;
        const keywords = ["user", "account", "profile", "email", "token", "id", "auth"];
        return keywords.some(k => text.toLowerCase().includes(k));
    }

    // --- Patch fetch ---
    const origFetch = window.fetch;
    window.fetch = async (...args) => {
        const [url, options] = args;
        const method = (options && options.method) || "GET";
        try {
            const response = await origFetch.apply(this, args);
            const clone = response.clone(); // clone so body is still usable
            const label = looksSensitive(url) ? "🔎 Sensitive?" : "➡️";

            clone.text().then(body => {
                console.groupCollapsed(
                    `${label} Fetch [${method}] ${url} → ${response.status}`
                );
                console.log("Request options:", options || {});
                console.log("Response body (truncated):", body.slice(0, 500));
                console.groupEnd();
            });

            return response;
        } catch (e) {
            console.error("Fetch error:", e);
            throw e;
        }
    };

    // --- Patch XHR ---
    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this._url = url;
        this._method = method;
        return origOpen.apply(this, [method, url, ...rest]);
    };

    XMLHttpRequest.prototype.send = function(body) {
        this.addEventListener("load", function() {
            const label = looksSensitive(this._url) ? "🔎 Sensitive?" : "➡️";
            console.groupCollapsed(
                `${label} XHR [${this._method}] ${this._url} → ${this.status}`
            );
            console.log("Request body:", body || {});
            console.log("Response body (truncated):", this.responseText.slice(0, 500));
            console.groupEnd();
        });
        return origSend.apply(this, arguments);
    };

    alert("Now logging API calls with expandable details. Open console and expand entries to inspect.");
})();





// The snippet logs bellow:
// • Timestamp – when the request happened
// • Request type / purpose – inferred from URL or payload using heuristics (e.g., login, profile fetch, search)
// • Method + URL + status code
// • Expandable details – request body/options and truncated response body


(function() {
    // --- Define heuristics for request types ---
    const requestLabels = [
        { pattern: /login/i, label: "Login request" },
        { pattern: /logout/i, label: "Logout request" },
        { pattern: /profile|user/i, label: "Fetch user profile" },
        { pattern: /search/i, label: "Search query" },
        { pattern: /comment/i, label: "Post comment" },
        { pattern: /order|checkout/i, label: "Order/Checkout" },
        { pattern: /token/i, label: "Auth token request" }
        // Add more as needed
    ];

    function getRequestLabel(url, body) {
        for (const item of requestLabels) {
            if (item.pattern.test(url) || (body && item.pattern.test(body))) {
                return item.label;
            }
        }
        return "Unknown request";
    }

    function getTimestamp() {
        return new Date().toISOString().split("T")[1].split("Z")[0]; // HH:MM:SS.sss
    }

    // --- Patch fetch ---
    const origFetch = window.fetch;
    window.fetch = async (...args) => {
        const [url, options] = args;
        const method = (options && options.method) || "GET";
        try {
            const response = await origFetch.apply(this, args);
            const clone = response.clone(); // clone so body is still usable
            const label = getRequestLabel(url, options?.body);
            const timestamp = getTimestamp();

            clone.text().then(body => {
                console.groupCollapsed(
                    `[${timestamp}] ${label} [FETCH ${method}] ${url} → ${response.status}`
                );
                console.log("Request options:", options || {});
                console.log("Response body (truncated):", body.slice(0, 500));
                console.groupEnd();
            });

            return response;
        } catch (e) {
            console.error("Fetch error:", e);
            throw e;
        }
    };

    // --- Patch XHR ---
    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this._url = url;
        this._method = method;
        return origOpen.apply(this, [method, url, ...rest]);
    };

    XMLHttpRequest.prototype.send = function(body) {
        this.addEventListener("load", function() {
            const label = getRequestLabel(this._url, body);
            const timestamp = getTimestamp();
            console.groupCollapsed(
                `[${timestamp}] ${label} [XHR ${this._method}] ${this._url} → ${this.status}`
            );
            console.log("Request body:", body || {});
            console.log("Response body (truncated):", this.responseText.slice(0, 500));
            console.groupEnd();
        });
        return origSend.apply(this, arguments);
    };

    alert("Now logging API calls with timestamps and inferred request types. Check console.");
})();


//Features
// • Timestamped logs: [HH:MM:SS.sss]
// • Request type inferred: login, profile, search, etc.
// • Expandable details: click to see request body/options and truncated response
// • Works for both fetch and XHR`




// extending the previous snippet to highlight likely sensitive endpoints while keeping timestamps and request-type labeling.
// the upgraded version bellow:


(function() {
    // --- Define heuristics for request types ---
    const requestLabels = [
        { pattern: /login/i, label: "Login request" },
        { pattern: /logout/i, label: "Logout request" },
        { pattern: /profile|user/i, label: "Fetch user profile" },
        { pattern: /search/i, label: "Search query" },
        { pattern: /comment/i, label: "Post comment" },
        { pattern: /order|checkout/i, label: "Order/Checkout" },
        { pattern: /token|auth/i, label: "Auth token request" }
        // Add more as needed
    ];

    // --- Define keywords to mark sensitive endpoints ---
    const sensitiveKeywords = ["user", "profile", "email", "token", "auth", "id"];

    function getRequestLabel(url, body) {
        for (const item of requestLabels) {
            if (item.pattern.test(url) || (body && item.pattern.test(body))) {
                return item.label;
            }
        }
        return "Unknown request";
    }

    function isSensitive(url, body) {
        return sensitiveKeywords.some(k => url.toLowerCase().includes(k) || (body && body.toLowerCase().includes(k)));
    }

    function getTimestamp() {
        return new Date().toISOString().split("T")[1].split("Z")[0]; // HH:MM:SS.sss
    }

    // --- Patch fetch ---
    const origFetch = window.fetch;
    window.fetch = async (...args) => {
        const [url, options] = args;
        const method = (options && options.method) || "GET";
        try {
            const response = await origFetch.apply(this, args);
            const clone = response.clone();
            const label = getRequestLabel(url, options?.body);
            const timestamp = getTimestamp();
            const sensitive = isSensitive(url, options?.body);

            clone.text().then(body => {
                console.groupCollapsed(
                    `%c[${timestamp}] ${label} [FETCH ${method}] ${url} → ${response.status}`,
                    sensitive ? "color:red;font-weight:bold;" : "color:black;"
                );
                console.log("Request options:", options || {});
                console.log("Response body (truncated):", body.slice(0, 500));
                console.groupEnd();
            });

            return response;
        } catch (e) {
            console.error("Fetch error:", e);
            throw e;
        }
    };

    // --- Patch XHR ---
    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this._url = url;
        this._method = method;
        return origOpen.apply(this, [method, url, ...rest]);
    };

    XMLHttpRequest.prototype.send = function(body) {
        this.addEventListener("load", function() {
            const label = getRequestLabel(this._url, body);
            const timestamp = getTimestamp();
            const sensitive = isSensitive(this._url, body);
            console.groupCollapsed(
                `%c[${timestamp}] ${label} [XHR ${this._method}] ${this._url} → ${this.status}`,
                sensitive ? "color:red;font-weight:bold;" : "color:black;"
            );
            console.log("Request body:", body || {});
            console.log("Response body (truncated):", this.responseText.slice(0, 500));
            console.groupEnd();
        });
        return origSend.apply(this, arguments);
    };

    alert("API monitoring active: timestamps, inferred request type, and sensitive calls highlighted in red.");
})();


// What this adds
// • Red-highlighted logs for likely sensitive endpoints (user data, auth, tokens, emails).
// • Timestamps to track when requests happened.
// • Request-type labeling (login, profile fetch, search, etc.).
// • Expandable logs for request and truncated response details.





// this is a noise-free and focused version.
// This version will:
// • Only log “likely sensitive” endpoints (based on keywords like user, profile, email, token, etc.)
// • Keep timestamps
// • Show inferred request type (login, profile fetch, etc.)
// • Keep expandable request/response details
// • Ignore non-sensitive calls to reduce clutter


(function() {
    // --- Heuristics for request types ---
    const requestLabels = [
        { pattern: /login/i, label: "Login request" },
        { pattern: /logout/i, label: "Logout request" },
        { pattern: /profile|user/i, label: "Fetch user profile" },
        { pattern: /search/i, label: "Search query" },
        { pattern: /comment/i, label: "Post comment" },
        { pattern: /order|checkout/i, label: "Order/Checkout" },
        { pattern: /token|auth/i, label: "Auth token request" }
    ];

    // --- Keywords marking sensitive endpoints ---
    const sensitiveKeywords = ["user", "profile", "email", "token", "auth", "id"];

    function getRequestLabel(url, body) {
        for (const item of requestLabels) {
            if (item.pattern.test(url) || (body && item.pattern.test(body))) {
                return item.label;
            }
        }
        return "Unknown request";
    }

    function isSensitive(url, body) {
        return sensitiveKeywords.some(k => url.toLowerCase().includes(k) || (body && body.toLowerCase().includes(k)));
    }

    function getTimestamp() {
        return new Date().toISOString().split("T")[1].split("Z")[0]; // HH:MM:SS.sss
    }

    // --- Patch fetch ---
    const origFetch = window.fetch;
    window.fetch = async (...args) => {
        const [url, options] = args;
        const method = (options && options.method) || "GET";
        try {
            const response = await origFetch.apply(this, args);
            const clone = response.clone();
            const label = getRequestLabel(url, options?.body);
            const timestamp = getTimestamp();

            if (isSensitive(url, options?.body)) {
                clone.text().then(body => {
                    console.groupCollapsed(
                        `%c[${timestamp}] ${label} [FETCH ${method}] ${url} → ${response.status}`,
                        "color:red;font-weight:bold;"
                    );
                    console.log("Request options:", options || {});
                    console.log("Response body (truncated):", body.slice(0, 500));
                    console.groupEnd();
                });
            }

            return response;
        } catch (e) {
            console.error("Fetch error:", e);
            throw e;
        }
    };

    // --- Patch XHR ---
    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this._url = url;
        this._method = method;
        return origOpen.apply(this, [method, url, ...rest]);
    };

    XMLHttpRequest.prototype.send = function(body) {
        this.addEventListener("load", function() {
            const label = getRequestLabel(this._url, body);
            const timestamp = getTimestamp();

            if (isSensitive(this._url, body)) {
                console.groupCollapsed(
                    `%c[${timestamp}] ${label} [XHR ${this._method}] ${this._url} → ${this.status}`,
                    "color:red;font-weight:bold;"
                );
                console.log("Request body:", body || {});
                console.log("Response body (truncated):", this.responseText.slice(0, 500));
                console.groupEnd();
            }
        });
        return origSend.apply(this, arguments);
    };

    alert("Sensitive API monitoring active! Only likely sensitive calls will appear in console, highlighted in red.");
})();


// • Features of this version
// • Only logs likely sensitive endpoints → massive reduction in noise
// • Red-highlighted entries → immediately visible
// • Expandable logs → request + truncated response
// • Timestamp + inferred request type → track actions easily
// This is now a focused bug-hunting tool for user-related API calls.
