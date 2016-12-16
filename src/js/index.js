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
                    let exitBtn = document.querySelector('.exit');
                    let input = document.querySelector('.text');
                    let content = document.querySelector('.content');

                    $interval(() => {
                        sockService.deferred.then(res => {
                            let div = document.createElement('div');
                            div.classList.add('greeting');
                            res = res.pop();
                            let text = res;
                            if (res && res.welcomeMsg) {
                                if (text) {
                                    $scope.users = text.users;
                                    div.innerHTML = text.welcomeMsg;
                                    content.appendChild(div);
                                }
                            } else if (res && res.user) {
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
                            } else if (res && res.disconnectMsg) {
                                if (text) {
                                    $scope.users = text.users;
                                    let time = text.time.replace(/(\d{2}:\d{2}:\d{2}).+/, '$1');
                                    div.innerHTML = text.disconnectMsg + ' ' + time;
                                    content.appendChild(div);
                                }
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
                    $scope.exit = () => {
                        sockService.ws.close();
                        location.reload();
                    };
                    function sendDataToBackend(input) {
                        sockService.ws.send(JSON.stringify({ value: input.value }));
                        input.value = '';
                    }
                }
            })
    })
    .controller('mainCtrl', function ($scope, $state, sockService) {
        $scope.login = () => {
            sendMsg();
        };
        function sendMsg() {
            $scope.isHide = true;
            let name = document.getElementById('username').value;
            sockService.ws.send(JSON.stringify({ name: name }));
        }
        $scope.enter = (e) => {
            if (e.keyCode == 13) {
                sendMsg();
                $state.go('home');
            }
        };
    })
