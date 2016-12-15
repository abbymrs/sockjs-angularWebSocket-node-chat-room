angular.module('myApp', [
    'service.sock',
    'ui.router'
])
    .config(($stateProvider) => {
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'views/home.html',
                controller: function ($scope, $interval, sockService) {
                    let value = null;
                    let btn = document.querySelector('.send-btn');
                    let input = document.querySelector('.text');
                    let content = document.querySelector('.content');

                    $interval(() => {
                        sockService.deferred.then(res => {
                            let div = document.createElement('div');
                            let text;
                            res = res.pop();
                            try {
                                text = JSON.parse(res);
                                let domStr = `
                                    <div class="user-details">
                                        <span class="username"></span>
                                        <time class="time"></time>
                                    </div>
                                    <div class="msg"></div>
                                `;
                                if (text) {
                                    div.innerHTML = domStr;
                                    content.appendChild(div);
                                    let time = text.time.replace(/(\d{2}:\d{2}:\d{2}).+/, '$1');
                                    div.querySelector('.username').innerHTML = text.user;
                                    div.querySelector('.time').innerHTML = time;
                                    div.querySelector('.msg').innerHTML = text.content;
                                }
                            } catch (e) {
                                text = res;
                                if (text) {
                                    div.innerHTML = text;
                                    content.appendChild(div);
                                }
                            }
                            // console.log(text);

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
                        sockService.ws.send({ value: input.value });
                        input.value = '';
                    }
                }
            })
    })
    .controller('mainCtrl', function ($scope, $interval, sockService) {
        $scope.login = () => {
            $scope.isHide = true;
            let name = document.getElementById('username').value;
            sockService.ws.send({ name: name });
        };
    })
