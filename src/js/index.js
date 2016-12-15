angular.module('myApp', [
    'service.sock',
    'ui.router'
])
    .config(($stateProvider) => {
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'views/home.html',
                controller: function($scope, $interval, sockService){
                    let value = null;
                    let btn = document.querySelector('.send-btn');
                    let input = document.querySelector('.text');
                    let content = document.querySelector('.content');
                    $scope.hideLogin = ()=>{

                    };
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
                        sockService.ws.send({value:input.value});
                        input.value = '';
                    }
                }
            })
    })
    .controller('mainCtrl', function ($scope, $interval, sockService) {
        $scope.login = ()=>{
            $scope.isHide = true;
            let name = document.getElementById('username').value;
            sockService.ws.send({name: name});
        };
    })
