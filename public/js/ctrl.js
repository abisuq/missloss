var app = angular.module('ml', ['contenteditable']);
var date = new Date();
var time = {
  date: date,
  year : date.getFullYear(),
  month : date.getFullYear() + "-" + (date.getMonth() + 1),
  day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
  minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
  date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
}

function IndexCtrl($scope, $http) {
    $scope.words = "";
    $scope.love = true;
    $scope.box = false;
    $scope.time = time;
    $scope.page = 1;
    $scope.reged = true;
    $scope.checkKey = function() {
        $scope.love = !~$scope.words.indexOf('@fuck');
        $scope.share = !!~$scope.words.indexOf('@unlock');
        $scope.edit = !!~$scope.words.indexOf('@edit');
    };
    var getSession = function() {
        $http.get('/api/session').success(function(data, status, headers, config) {
            $scope.username = data.username;
            if($scope.username === data.username){
                getPost();
            }
        });
    };
    var getPost = function() {
        $scope.state = $scope.love? "miss":"loss";
        $http.get('/api/posts/' + $scope.username + '/' + $scope.state + '/' + $scope.page).success(function(data, status, headers, config) {
            $scope.posts = data.posts;
            $scope.total = data.total;
            $scope.isFirstPage = (($scope.page - 1) == 0);
            $scope.isLastPage = ((($scope.page - 1) * 10 + $scope.posts.length) == $scope.total);
        });
    };
    getSession();
    $scope.$watch('love', getPost);
    $scope.$watch('page', getPost);
    $scope.submitPost = function () {
        if(!$scope.username){
            $scope.msg = "请先登录！"
        }else{
            $scope.form = {};
            var re=/(<([^>]+)>)/ig;
            $scope.form.post = $scope.words.replace(re,'').replace(/&amp;nbsp; /g, '').replace(/&nbsp;/g, '').replace(/@fuck/g, '').replace(/@unlock/g, '').replace(/@edit/g, '');
            if ($scope.form.post.length) { 
                $scope.form.state = ($scope.love ? "miss":"loss");
                $scope.form.share = $scope.share;
                $scope.words = ($scope.love ? "":"@fuck");
                $http.post('/api/post', $scope.form).
                    success(function() {
                        getPost();
                    });
            }else {
                $scope.msg = "你一个字都没写呢。"
            }
        }
    };

    $scope.reg = function () {
        if ($scope.user.name && $scope.user.password) {
            $http.post('/api/reg', $scope.user).success(function(){
                getSession();
            }); 
        }     
    };
    $scope.login = function () {
        if ($scope.user.name && $scope.user.password) {
            $http.post('/api/login', $scope.user).success(function(data){
                $scope.msg = data.msg;
                getSession();
            }); 
        }     
    };
    $scope.logout = function () {
        $scope.reged = true;
        if ($scope.username) {
            $scope.username = null;
            $http.post('/api/logout').success(function(data){
                $scope.msg = data.msg;
                getSession();
            }); 
        }     
    };
    $scope.delete = function (id) {
        if ($scope.username) {
            $http.delete('/api/deletePost/' + id).success(function(data){
                $scope.msg = data.msg;
                getPost();
            }); 
        }
    };
};








    