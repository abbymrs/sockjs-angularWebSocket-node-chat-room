angular.module('service.sock', [
    'ngWebSocket'
])
    .factory('sockService', function ($q, $websocket) {
        const wsUrl = 'ws://127.0.0.1:3000/echo/websocket';
        let result = [];
        let deferred = $q.defer();

        var ws = $websocket(wsUrl);
        ws.onMessage(function (message) {
            result.push(message.data);
            // console.log(result);
            deferred.resolve(result);
        });
        ws.onOpen(() => {
            console.log('opening...');
        });
        ws.onError((err) => {
            console.log(err);
            deferred.reject(err);
        });
        ws.onClose(() => {
            console.log('close');
        });
        return {
            deferred: deferred.promise,
            ws: ws
        };


        // let ws = new WebSocket(wsUrl);

        // ws.onmessage = function (e) {
        //     result.push(e.data);
        //     deferred.resolve(result);
        // }

        // ws.onopen = function () {
        //     console.log('opening...')
        //     // ws.send('hello server')
        // }

        // ws.onerror = function (error) {
        //     console.log('WEbSocket error ' + error);
        //     deferred.reject(error);
        // }
        // return deferred.promise;
    });