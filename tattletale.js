;(function(window) {
    'use strict';

// Constructor _______________________________________________________________

    /**
     * Creates a new TattleTale instance used to store console logs for
     * sending over XHR.
     *
     * @constructor
     *
     * @param {string} url The XHR path used to send the console logs.
     * @param {Object} static_request_data Static data to send along with each
     *     request, such as a cross-site request forgery token.
     */
    function Tattletale(url, static_request_data) {
        var self = this;

        if (typeof url !== 'string') {
            throw new Error('Tattletale instances require a URL for log submission over XHR.');
        }

        self.url = url;
        self.request_data = (typeof static_request_data === 'object') ? static_request_data : {};
        self.logs = [];
    }

// Internal Methods __________________________________________________________

    /**
     * Takes an object and converts its key/value pairs into a querystring
     * format that can be sent through with the request. This method will be
     * called recursively if any of the keys are an object or an array.
     *
     * @param {Object} object The object to convert to query string format.
     * @param {string} base A base prefix for multidimensional keys.
     */
    function convertObjectToQueryString(object, base) {
        var query_string = [],
            temp_qs = {},
            key, value, result, i, limit;

        for (key in object) {
            if (object.hasOwnProperty(key)) {
                value = object[key];

                // Update name of the key if it had to be broken up into
                // query string array format.
                if (base) {
                    key = base + '[' + key + ']';
                }

                switch(Object.prototype.toString.call(value)) {
                    case '[object Object]':
                        result = convertObjectToQueryString(value, key);
                        break;
                    case '[object Array]':
                        for (i = 0, limit = value.length; i < limit; i++) {
                            temp_qs[i] = value[i];
                        }

                        result = convertObjectToQueryString(temp_qs, key);
                        break;
                    default:
                        result = key + '=' + encodeURIComponent(value);
                }

                if (value !== null) {
                    query_string.push(result);
                }
            }
        }

        return query_string.join('&');
    }

// Public Methods ____________________________________________________________

    Tattletale.prototype = {

        /**
         * Proxies calls to console.log, storing the logs into an array which
         * can be sent up to the server at a later time.
         */
        log: function() {
            var logs = this.logs,
                arguments_string = '',
                arguments_length = arguments.length,
                args, i, argument, argument_type;

            if (arguments_length === 0) {
                return;
            }

            args = [].slice.call(arguments);

            for (i = 0; i < arguments_length; i++) {
                argument = args[i];
                argument_type = typeof argument;

                // Only strings, numbers, and booleans will be reported
                if (argument_type === 'string' || argument_type === 'number' || argument_type === 'boolean') {
                    arguments_string += argument;
                }
                else {
                    arguments_string += '[Object object]';
                }

                if (i < arguments_length - 1) {
                    arguments_string += ', ';
                }
            }

            // Limit to 100 logs
            if (logs.length > 100) {
                logs.splice(0, 1);
            }

            logs.push(arguments_string);

            if (typeof window.console !== 'undefined' && typeof window.console.log === 'function') {
                window.console.log.apply(window.console, arguments);
            }
        },

        /**
         * Clears out the logs array.
         */
        empty: function() {
            this.logs = [];
        },

        /**
         * Posts the log object to the instance's URL path. If the request is
         * successful, the empty() method will be called automatically.
         *
         * @param {Function} callback An optional XHR success callback.
         */
        send: function(callback) {
            var self = this,
                request = new XMLHttpRequest(),
                data_to_send = null;

            self.request_data.console_logs = self.logs;
            data_to_send = convertObjectToQueryString(self.request_data);
            self.empty();

            request.onreadystatechange = function() {
                if (request.readyState === 4) {
                    if (typeof callback === 'function') {
                        callback();
                    }
                }
            };

            request.open('POST', self.url, true);
            request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

            request.send(data_to_send);
        }
    };

// Exports ___________________________________________________________________

    window.Tattletale = Tattletale;

})(window);