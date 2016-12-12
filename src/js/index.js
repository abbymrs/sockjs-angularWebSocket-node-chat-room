angular.module('myApp', [
    'service.sock'
])
    .controller('mainCtrl', function ($scope, $interval, sockService) {
        let value = null;
        let btn = document.querySelector('.btn');
        let input = document.querySelector('.text');
        let content = document.querySelector('.content');
        $interval(() => {
            sockService.deferred.then(res => {
                let div = document.createElement('div');
                let text = res.pop();
                if (text) {
                    div.innerHTML = text;
                    content.appendChild(div);
                }
                input.onkeyup = (e) => {
                    if (e.keyCode == 13) {
                        sendDataToBackend(input);
                    }
                };
                btn.onclick = () => {
                    sendDataToBackend(input);
                };
            });
        }, 1000);

        function sendDataToBackend(input) {
            sockService.ws.send(input.value);
            input.value = '';
        }
    })
