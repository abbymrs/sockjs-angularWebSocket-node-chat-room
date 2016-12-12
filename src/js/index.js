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
                $scope.data = res;
                let div = document.createElement('div');
                let text = res.splice(res.length - 1, 1);
                if (text.length > 0) {
                    div.innerHTML = text;
                    content.appendChild(div);
                }
                input.onkeyup = (e) => {
                    if (e.keyCode == 13) {
                        appendContent(input, div, content, res);
                    }
                };
                btn.onclick = () => {
                    appendContent(input, div, content, res);
                };
            });
        }, 1000);

        function appendContent(input, div, content, res) {
            sockService.ws.send(input.value);
            if (res.length > 0) {
                div.innerHTML = res;
                content.appendChild(div);
            }
            input.value = '';
        }

    })
