(function () {
    // Save original Methods
    const OriginalOpen = XMLHttpRequest.prototype.open;
    const OriginalSend = XMLHttpRequest.prototype.send;
    const OriginalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

    let requestHeaders = {};

    // Hook into the open method
    XMLHttpRequest.prototype.open = function(_, url) {
        console.log('Request URL:', url);
        return OriginalOpen.apply(this, arguments);
    };

    // Hook into the setRequestHeader method
    XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
        requestHeaders[header] = value;
        return OriginalSetRequestHeader.apply(this, arguments);
    };

    // Hook into the send method
    XMLHttpRequest.prototype.send = function() {
        this.addEventListener("load", function() {
            // only intercept if the request succeeds
            const data = {
                url: this.responseURL,
                status: this.status,
                response: this.responseText,
                headers: requestHeaders
            }

            // Dispatch a custom event with the data
            window.dispatchEvent(new CustomEvent("xhrDataFetched", {detail: data}));
        })

        return OriginalSend.apply(this, arguments);
    }
})();