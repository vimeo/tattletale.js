// Type definitions for Tattletale.js
// Project: https://github.com/vimeo/tattletale.js
// Definitions by: iconix <https://github.com/iconix>
// Based on: http://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-class-d-ts.html

/*~ Write your module's methods and properties in this class */
declare class __Tattletale {
    constructor(url: string, static_request_data?: Object);

    someProperty: string[];

    log(data: string | number | boolean): void;

    empty(): void;

    send(callback?: Function): void;
}

/*~ This declaration specifies that the class constructor function
 *~ is the exported object from the file
 *~
 *~ Note that ES6 modules cannot directly export class objects.
 *~ This file should be imported using the CommonJS-style:
 *~   import x = require('someLibrary');
 *~
 *~ Refer to the documentation to understand common
 *~ workarounds for this limitation of ES6 modules.
 */
declare module 'Tattletale' {
    export = __Tattletale;
}
