(function() {
    'use strict';

// Properties ________________________________________________________________

    var expect = chai.expect,
        debug_obj,
        console_stub;

// Test Suite ________________________________________________________________

    describe('Tattletale', function() {
        beforeEach(function() {
            console_stub = sinon.stub(window.console, 'log', function() {
                // Don't print hundreds of logs to the console
            });
        });

        afterEach(function() {
            console_stub.restore();
        });

        it('should expose its log() method', function() {
            debug_obj = new Tattletale('/log');
            expect(debug_obj).to.respondTo('log');
        });

        it('should expose its empty() method', function() {
            debug_obj = new Tattletale('/log');
            expect(debug_obj).to.respondTo('empty');
        });

        it('should expose its send() method', function() {
            debug_obj = new Tattletale('/log');
            expect(debug_obj).to.respondTo('send');
        });

        it('should throw if no URL was passed to the constructor', function() {
            var errors = 0;

            try {
                debug_obj = new Tattletale();
            }
            catch(x) {
                errors++;
            }

            expect(errors).to.equal(1);
        });

        describe('.log()', function() {
            beforeEach(function() {
                debug_obj = new Tattletale('/log');
            });

            it('should exit if no arguments were passed', function() {
                debug_obj.log();

                expect(debug_obj.logs).to.have.length(0);
            });

            it('should accept a variable number of arguments', function() {
                debug_obj.log('1');
                debug_obj.log('2');
                debug_obj.log('3');

                expect(debug_obj.logs).to.have.length(3);
            });

            it('should log strings', function() {
                debug_obj.log('foo');

                expect(debug_obj.logs).to.have.length(1);
            });

            it('should log numbers', function() {
                debug_obj.log(42);

                expect(debug_obj.logs).to.have.length(1);
            });

            it('should log booleans', function() {
                debug_obj.log(true);
                debug_obj.log(false);

                expect(debug_obj.logs).to.have.length(2);
            });

            it('should not log entire objects', function() {
                debug_obj.log({
                    'foo': 'bar'
                });

                expect(debug_obj.logs[0]).to.equal('[Object object]');
            });

            it('should pass through to the actual console.log() method', function() {
                debug_obj.log('Howdy world!');

                expect(console_stub).to.have.been.calledOnce;
            });

            it('should remove the first log if the length of queued logs exceeds 100', function() {
                var i = 0;

                debug_obj.log('puppies');

                for (i = 0; i < 101; i++) {
                    debug_obj.log(i);
                }

                expect(debug_obj.logs[0]).to.not.equal('puppies');
            });
        });

        describe('.empty()', function() {
            beforeEach(function() {
                debug_obj = new Tattletale('/log');
            });

            it('should remove all logs from the queue', function() {
                debug_obj.log('puppies');
                debug_obj.log('kittens');

                expect(debug_obj.logs).to.have.length(2);

                debug_obj.empty();

                expect(debug_obj.logs).to.be.empty;
            });
        });

        describe('.send()', function() {
            var requests = [],
                callback_spy,
                xhr;

            beforeEach(function() {
                xhr = sinon.useFakeXMLHttpRequest();
                xhr.onCreate = function(xhr) {
                    requests.push(xhr);
                };

                callback_spy = sinon.spy();

                debug_obj = new Tattletale('/log');
                debug_obj.log('puppies');
            });

            afterEach(function() {
                requests = [];
                xhr.restore();
            });

            it('should accept a callback argument', function() {
                var send_spy = sinon.spy(Tattletale.prototype, 'send');

                debug_obj.send(callback_spy);

                expect(send_spy).to.have.been.calledOnce;
                expect(send_spy).to.have.been.calledWith(callback_spy);

                send_spy.restore();
            });

            it('should call the callback argument', function() {
                debug_obj.send(callback_spy);

                requests[0].respond(200, {
                    'Content-Type': 'text/html; charset=UTF-8'
                });

                expect(callback_spy).to.have.been.calledOnce;
            });

            it('should empty the logs queue', function() {
                expect(debug_obj.logs).to.have.length(1);

                debug_obj.send();

                requests[0].respond(200, {
                    'Content-Type': 'text/html; charset=UTF-8'
                });

                expect(debug_obj.logs).to.be.empty;
            });
        });
    });
}());