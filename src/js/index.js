angular.module('myApp', [
    'service.sock'
])
    .controller('mainCtrl', function ($scope, $websocket, $interval, sockService) {
        let value = null;
        let btn = document.querySelector('.btn');
        let input = document.querySelector('.text');
        let content = document.querySelector('.content');
        $interval(() => {
            sockService.deferred.then(res => {
                $scope.data = res;
                let div = document.createElement('div');
                div.innerHTML = res.splice(res.length - 1, 1);
                content.appendChild(div);
                input.onkeyup = (e) => {
                    let value = input.value;
                    if (e.keyCode == 13) {

                        sockService.ws.send(value);
                        div.innerHTML = res;
                        content.appendChild(div);
                        input.value = '';

                    }
                };
                btn.onclick = () => {
                    let div = document.createElement('div');
                    div.innerHTML = value;
                    content.appendChild(div)
                    sockService.ws.send(input.value);
                    input.value = '';
                    console.log('send');
                }
            })
        }, 1000);

    })
