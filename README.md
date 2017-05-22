# Tattletale.JS

Tattletale wraps around the browser’s `console` object, storing your logs in order to send them over XHR for long-term storage and analysis using a service like [Scribe](http://github.com/facebook/scribe).

## Usage

```javascript
var tattletale = new Tattletale('/log');

tattletale.log('“My name is Ozymandias, king of kings:');
tattletale.log('Look on my works, ye Mighty, and despair!”');

tattletale.send();
```

When the `send()` method is called, an array of all log calls made since the last `send()` call will be submitted to the server as an array of request parameters name `console_logs`:

```
# Form Data
console_logs[0]:“My name is Ozymandias, king of kings:
console_logs[1]:Look on my works, ye Mighty, and despair!”
```

The `empty()` method will be automatically triggered to prevent duplicate entries from appearing in your logs.

### Options

In addition to a server-side endpoint, the constructor also accepts an object of static parameters to be sent along with your request. For example, if your `POST` requests need to include a token to prevent against [XSRF](http://en.wikipedia.org/wiki/Cross-site_request_forgery):

```javascript
var tattletale = new Tattletale('/log', {
    token: window.xsrft
});
```

A third argument is allowed for general configuration, such as disabling console logging:

```javascript
var tattletale = new Tattletale('/log', {}, {
    consoleLoggingDisabled: true
});
```


