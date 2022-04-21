// Begin set up firebase
import {
    initializeApp
} from 'https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js';

const firebaseConfig = {
    apiKey: "AIzaSyDjt28Eulb8IPG98WhaDhpSJ5GvENiql3k",
    authDomain: "frontend-thangnnc.firebaseapp.com",
    databaseURL: "https://frontend-thangnnc-default-rtdb.firebaseio.com",
    projectId: "frontend-thangnnc",
    storageBucket: "frontend-thangnnc.appspot.com",
    messagingSenderId: "420628651369",
    appId: "1:420628651369:web:6d2ed7eea3fa7ef72f31f8",
    measurementId: "G-D6G8WZM4BH"
};

const appFB = initializeApp(firebaseConfig);

import {
    getDatabase,
    ref,
    set,
    child,
    get
}
from 'https://www.gstatic.com/firebasejs/9.6.3/firebase-database.js';

const db = getDatabase();
// End set up firebase

// Begin AngularJS
var app = angular.module("thangnncApp", ['ngRoute']);
app.config($routeProvider => {
    $routeProvider
        .when("/course/:typeCourse/:typeNameCourse", {
            title: "Khóa học",
            templateUrl: "components/course.html",
            controller: "course-ctrl"
        })
        .when("/quiz/:idCourse/:nameCourse", {
            title: "Thi trắc nghiệm",
            templateUrl: "components/quiz.html",
            controller: "quiz-ctrl"
        })
        .when("/signin", {
            title: "Đăng nhập",
            templateUrl: "components/signin.html",
            controller: "signin-ctrl"
        })
        .when("/forget", {
            title: "Quên mật khẩu",
            templateUrl: "components/forgetPassword.html",
            controller: "forget-ctrl"
        })
        .when("/signup", {
            title: "Đăng  kí",
            templateUrl: "components/signup.html",
            controller: "signup-ctrl"
        })
        .when("/about", {
            title: "Thông tin",
            templateUrl: "components/about.html",
            controller: "about-ctrl"
        })
        .when("/contact", {
            title: "Liên hệ",
            templateUrl: "components/contact.html",
            controller: "contact-ctrl"
        })
        .when("/profile", {
            title: "Tài khoản của tôi",
            templateUrl: "components/profile.html",
            controller: "profile-ctrl"
        })
        .when("/profile/:change-password", {
            title: "Đổi mật khẩu",
            templateUrl: "components/changePassword.html",
            controller: "profile-ctrl"
        })
        .otherwise({
            title: "Trang chủ",
            templateUrl: "components/home.html",
            controller: "home-ctrl"
        });
})

// Begin set title for page
app.run(['$rootScope', '$route', function ($rootScope, $route) {
    $rootScope.$on('$routeChangeSuccess', function () {
        document.title = $route.current.title;
    });
}]);
// End set title for page

// Begin required present password
app.directive("presentPass", ['$rootScope', function ($rootScope) {
    return {
        require: "ngModel",
        link: function (scope, element, attr, mCtrl) {
            mCtrl.$parsers.push(function (value) {
                if (value == $rootScope.account.password) {
                    mCtrl.$setValidity('charE', true);
                } else {
                    mCtrl.$setValidity('charE', false);
                }
                return value;
            })
        }
    }
}]);
app.directive("nonPresentPass", ['$rootScope', function ($rootScope) {
    return {
        require: "ngModel",
        link: function (scope, element, attr, mCtrl) {
            mCtrl.$parsers.push(function (value) {
                if (value != $rootScope.account.password) {
                    mCtrl.$setValidity('charE', true);
                } else {
                    mCtrl.$setValidity('charE', false);
                }
                return value;
            })
        }
    }
}])
// End required present password

//Begin controller of <body></body>
app.controller("thangnnc-ctrl", function ($scope, $rootScope, $http, $interval) {
    window.scroll(0, 0);

    $scope.user = {};
    //Check login account
    if (localStorage.username == null) {
        $rootScope.isLogin = false;
    } else {
        $scope.setAccount = $interval(function () {
            get(child(ref(db), "Users/" + localStorage.username)).then((snapshot) => {
                $rootScope.account = snapshot.val();
                console.log($rootScope.account);
            })
            if ($rootScope.account != undefined) $interval.cancel($scope.setAccount);
        }, 1000);
        $rootScope.isLogin = true;
    }
    // Function logout
    $rootScope.logout = function () {
        localStorage.removeItem("username");
        document.location = "index.html";
    }

    // Load data course when courses not underfined
    $scope.setCourses = $interval(function () {
        get(child(ref(db), "Courses")).then((snapshot) => {
            $rootScope.courses = Object.values((snapshot.val()));
        })
        if ($rootScope.courses != undefined) $interval.cancel($scope.setCourses);
    }, 1000);

})
// End controller of <body></body>

//Begin controller of Home Page
app.controller("home-ctrl", function ($scope, $rootScope) {
    window.scroll(0, 0);
})
//End controller of Home Page

//Begin controller of Course Page
app.controller("course-ctrl", function ($scope, $rootScope, $routeParams) {
    window.scroll(0, 0);
    document.title = $routeParams.typeNameCourse;

    $scope.typeCourse = $routeParams.typeCourse;
    $scope.title = $routeParams.typeNameCourse;
    $scope.tagPage = $routeParams.typeNameCourse;
})
//End controller of Course Page

//Begin controller of About Page
app.controller("about-ctrl", function ($scope) {
    window.scroll(0, 0);
})
//End controller of About Page

//Begin controller of About Page
app.controller("contact-ctrl", function ($scope) {
    window.scroll(0, 0);
})
//End controller of About Page

//Begin controller of Sign In Page
app.controller("signin-ctrl", function ($scope, $rootScope) {
    window.scroll(0, 0);
    $scope.login = function () {
        const dbRef = ref(db);
        get(child(dbRef, "Users/" + $scope.username)).then((snapshot) => {
            if (!snapshot.exists()) {
                alert("Tài khoản không tồn tại");
            } else {
                if ($scope.password != snapshot.val().password) {
                    alert("Sai mật khẩu!");
                } else {
                    alert("Đăng nhập thành công");
                    localStorage.username = snapshot.val().username;
                    document.location = "index.html";
                };
            }
        })
    }
})
//End controller of Sign In Page


//Begin controller of forget pass
app.controller("forget-ctrl", function ($scope, $rootScope) {
    window.scroll(0, 0);
    $scope.getPass = function () {
        get(child(ref(db), "Users/" + $scope.username)).then((snapshot) => {
            if (!snapshot.exists()) {
                alert("Tài khoản không tồn tại");
            } else {
                if ($scope.email != snapshot.val().email) {
                    alert("Sai email đăng kí!\nVui lòng nhập lại!");
                } else {
                    var user = snapshot.val();
                    user.password = "123456";
                    set(ref(db, "Users/" + user.username), user)
                        .then(() => {
                            alert("Mật khẩu của bạn đã được đổi thành: 123456");
                            document.location = "#!signin";
                        })
                        .catch(error => {
                            alert("Đổi mật khẩu thất bại! Lỗi: " + error);
                            return false;
                        });
                };
            }
        })
    }
})
//End controller of forget pass

//Begin controller of Sign Up Page
app.controller("signup-ctrl", function ($scope, $rootScope) {
    window.scroll(0, 0);
    $scope.user = {
        "username": null,
        "password": null,
        "fullname": null,
        "birthday": null,
        "email": null,
        "schoolfee": 0
    }

    document.querySelector("#birthday").type = "date";

    $scope.validate = function () {
        var check = 0;
        if ($scope.user.username == "" || $scope.user.username == null) {
            $scope.errorUsername = "Hãy nhập tên tài khoản!";
            check++;
        } else {
            $scope.errorUsername = null;
        }

        if ($scope.user.fullname == "" || $scope.user.fullname == null) {
            $scope.errorFullname = "Hãy nhập họ và tên của bạn!";
            check++;
        } else {
            $scope.errorFullname = null;
        }

        if ($scope.user.birthday == "" || $scope.user.birthday == null) {
            $scope.errorBirthday = "Hãy chọn ngày sinh của bạn!";
            check++;
        } else {
            $scope.errorBirthday = null;
        }

        if ($scope.user.email == "" || $scope.user.email == null) {
            $scope.errorEmail = "Hãy nhập email của bạn!";
            check++;
        } else {
            $scope.errorEmail = null;
        }
        
        if ($scope.user.password == "" || $scope.user.password == null) {
            $scope.errorPassword = "Hãy nhập mật khẩu!";
            check++;
        } else {
            $scope.errorPassword = null;
        }

        if ($scope.confirm == "" || $scope.confirm == null) {
            $scope.errorConfirm = "Hãy nhập lại mật khẩu!";
            check++;
        } else if($scope.confirm != $scope.user.password){
            $scope.errorConfirm = "Mật khẩu không trùng khớp!";
        } else{
            $scope.errorConfirm = null;
            check++;
        }

        if(check == 0) return true;
        else return false;
    }

    $scope.register = function () {

        if ($scope.validate()) {
            get(child(ref(db), "Users/" + $scope.user.username)).then((snapshot) => {
                if (snapshot.exists()) {
                    alert("Tài khoản đã tồn tại");
                    return false;
                } else {
                    set(ref(db, "Users/" + $scope.user.username), $scope.user)
                        .then(() => {
                            alert("Đăng kí thành công");
                            document.location = "#!signin";
                        })
                        .catch(error => {
                            alert("Đăng kí thất bại!Lỗi: " + error);
                            return false;
                        });
                }
            })
        }
    }
})
//End controller of Sign Up Page

//Begin controller of Profile Page
app.controller("profile-ctrl", function ($scope, $rootScope) {
    $scope.user = angular.copy($rootScope.account);
    $scope.updateAccount = () => {
        var text = document.querySelector(".btn_updateAccout");
        var textCancel = document.querySelector(".btn_changePass")
        if (text.innerHTML == "Chỉnh sửa") {
            text.innerHTML = "Lưu";
            // change button "Đổi mật khẩu"
            textCancel.innerHTML = "Hủy";
            textCancel.classList.remove("btn-blue");
            textCancel.classList.add("btn-secondary");

            var inputs = document.querySelector("#info_account").querySelectorAll("input");
            inputs.forEach(ele => {
                if (ele.getAttribute("id") != "username") {
                    ele.disabled = false;
                }
            });
            inputs[1].focus(); // Focus input fullname
            inputs[2].type = "date"; // Change type of Date
        } else {
            text.innerHTML = "Chỉnh sửa"; // Change name button
            // change button "Đổi mật khẩu"
            textCancel.innerHTML = "Đổi mật khẩu";
            textCancel.classList.add("btn-blue");
            textCancel.classList.remove("btn-secondary");

            // Disabled input in profile form
            var inputs = document.querySelector("#info_account").querySelectorAll("input");
            inputs.forEach(ele => ele.disabled = true);
            inputs[2].type = "text";

            // Update infomation of account in firebase
            set(ref(db, "Users/" + $scope.user.username), $scope.user)
                .then(() => {
                    $rootScope.account = angular.copy($scope.user);
                    alert("Cập nhật thông tin thành công");
                    document.location = "#!profile";
                })
                .catch(error => {
                    alert("Cập nhật thông tin thất bại! Lỗi: " + error);
                    return false;
                });
        }
    }

    $scope.cancel = function () {
        var text = document.querySelector(".btn_updateAccout");
        var textCancel = document.querySelector(".btn_changePass")
        if (textCancel.innerHTML == "Hủy") {
            text.innerHTML = "Chỉnh sửa"; // Change name button
            textCancel.innerHTML = "Đổi mật khẩu";
            textCancel.classList.add("btn-blue");
            textCancel.classList.remove("btn-secondary");

            // Disabled input in profile form
            var inputs = document.querySelector("#info_account").querySelectorAll("input");
            inputs.forEach(ele => ele.disabled = true);
            inputs[2].type = "text";
            $scope.user = angular.copy($rootScope.account);
        } else document.location = "#!profile/change-password"
    }

    $scope.mapPassword = function () {
        if ($scope.confirmPass == "" || $scope.confirmPass == undefined) return true;

        if ($scope.newPass == $scope.confirmPass) return true;
        else return false;
    }

    $scope.changePassword = function () {

        set(ref(db, "Users/" + $scope.account.username + "/password"), $scope.newPass)
            .then(() => {
                $rootScope.account.password = $scope.newPass;
                alert("Đổi mật khẩu thành công");
                document.location = "#!profile";
            })
            .catch(error => {
                alert("Cập nhật thông tin thất bại! Lỗi: " + error);
                return false;
            });
    }
})
//End controller of Profile Page

//Begin controller of Quiz Page
app.controller("quiz-ctrl", function ($scope, $rootScope, $routeParams, $interval) {
    if ($rootScope.isLogin == false) {
        alert("Vui lòng đăng nhập để có thể làm bài trắc nghiệm!");
        document.location = "#!signin"
    }

    window.scroll(0, 0);

    $scope.aphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    $scope.idCourse = $routeParams.idCourse;
    $scope.tagPage = $routeParams.nameCourse;
    $scope.idxQuestion = 0;
    $scope.per = 0;
    var numberQuestion = 10;
    $scope.answer = Array.from({
        length: numberQuestion
    }, () => -1); // check quiz
    // Get quiz by course id
    const dbRef = ref(db);

    get(child(dbRef, "Quizs/" + $scope.idCourse)).then((snapshot) => {
        $scope.questions = Object.values((snapshot.val())).sort(function () {
            return 0.5 - Math.random();
        }).slice(0, numberQuestion);
        console.log($scope.questions);
    })

    // $http.get("js/database/" + $scope.idCourse + ".js").then(d => {
    //     $scope.questions = d.data.sort(function () {
    //         return 0.5 - Math.random();
    //     }).slice(0, numberQuestion);
    // });

    // Function select and save answer
    $scope.selectAnswer = function (number) {
        $scope.answer[$scope.idxQuestion] = number;
        $scope.checkComplete();
    }

    // Function go to next question
    $scope.nextQuestion = () => {
        $scope.idxQuestion = $scope.idxQuestion + 1;
    }

    // Function go to previous question
    $scope.prevQuestion = () => {
        $scope.idxQuestion = $scope.idxQuestion - 1;
    }

    // Function check the progress of quiz
    $scope.checkComplete = function () {
        var count = 0;
        $scope.answer.forEach(ele => {
            if (ele != -1) count++;
        });
        $scope.per = Math.round((count * 100 / $scope.questions.length) * 100) / 100;
        document.querySelector(".progress-bar").style.width = $scope.per + "%";
    }

    $scope.mark = 0;
    $scope.finish = function () {
        var check = 0;
        for (let i = 0; i < $scope.questions.length; i++) {
            var answerId = $scope.questions[i].answerId;
            var answer = $scope.answer[i];
            if (answer != -1 && answerId == $scope.questions[i].answers[answer].id) {
                check++;
            }
        }
        $scope.mark = check;

        console.log($rootScope.account);
        set(ref(db, "Users/" + $rootScope.account.username + "/marks/" + $scope.idCourse), {
                "courseId": $scope.idCourse,
                "mark": $scope.mark
            })
            .then(() => {
                const dbRef = ref(db);
                get(child(dbRef, "Users/" + $rootScope.account.username)).then((snapshot) => {
                    $rootScope.account = snapshot.val();
                })
            })
            .catch(error => {
                alert("Lỗi: " + error);
            });
    }

    // Timer

    $scope.timeLimit = 600;
    $scope.minutes = parseInt($scope.timeLimit / 60);
    $scope.second = $scope.timeLimit % 60;

    $scope.setTime = function () {
        if ($scope.second == 0) {
            $scope.second = 59;
            $scope.minutes--;
        } else $scope.second--;
        console.log($scope.second);
    }

    $scope.timer = $interval(function () {
        if ($scope.minutes == 0 && $scope.second == 0) {
            $interval.cancel($scope.timer);
            alert("Hết giờ !")
            $scope.finish();
            document.location = "index.html";
        } else if ($scope.second == 0) {
            $scope.second = 59;
            $scope.minutes--;
        } else $scope.second--;
        setRemainingPathColor($scope.minutes * 60 + $scope.second);
    }, 1000);

    // // Credit: Mateusz Rybczonec
    const FULL_DASH_ARRAY = 283;
    const WARNING_THRESHOLD = 10;
    const ALERT_THRESHOLD = 5;
    const NORMAL_THRESHOLD = 120;

    const COLOR_CODES = {
        info: {
            color: "green",
            threshold: NORMAL_THRESHOLD
        },
        warning: {
            color: "orange",
            threshold: WARNING_THRESHOLD
        },
        alert: {
            color: "red",
            threshold: ALERT_THRESHOLD
        }
    };


    // const TIME_LIMIT = 600;
    // let timePassed = 0;
    // let timeLeft = TIME_LIMIT;
    // let timerInterval = null;
    let remainingPathColor = COLOR_CODES.info.color;

    // document.getElementById("app").innerHTML = `
    //     <div class="base-timer">
    //     <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    //         <g class="base-timer__circle">
    //         <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
    //         <path
    //             id="base-timer-path-remaining"
    //             stroke-dasharray="283"
    //             class="base-timer__path-remaining ${remainingPathColor}"
    //             d="
    //             M 50, 50
    //             m -45, 0
    //             a 45,45 0 1,0 90,0
    //             a 45,45 0 1,0 -90,0
    //             "
    //         ></path>
    //         </g>
    //     </svg>
    //     <span id="base-timer-label" class="base-timer__label">${formatTime(
    //         timeLeft
    //     )}</span>
    //     </div> `;

    // startTimer();

    // function onTimesUp() {
    //     clearInterval(timerInterval);
    // }

    // function startTimer() {
    //     timerInterval = setInterval(() => {
    //         timePassed = timePassed += 1;
    //         timeLeft = TIME_LIMIT - timePassed;
    //         document.getElementById("base-timer-label").innerHTML = formatTime(
    //             timeLeft
    //         );
    //         setCircleDasharray();
    //         setRemainingPathColor(timeLeft);

    //         if (timeLeft === 0) {
    //             onTimesUp();
    //         }
    //     }, 1000);
    // }

    // function formatTime(time) {
    //     const minutes = Math.floor(time / 60);
    //     let seconds = time % 60;

    //     if (seconds < 10) {
    //         seconds = `0${seconds}`;
    //     }

    //     return `${minutes}:${seconds}`;
    // }

    function setRemainingPathColor(timeLeft) {
        const {
            alert,
            warning,
            info
        } = COLOR_CODES;
        if (timeLeft <= alert.threshold) {
            document
                .getElementById("base-timer-path-remaining")
                .classList.remove(warning.color);
            document
                .getElementById("base-timer-path-remaining")
                .classList.add(alert.color);
        } else if (timeLeft <= warning.threshold) {
            document
                .getElementById("base-timer-path-remaining")
                .classList.remove(info.color);
            document
                .getElementById("base-timer-path-remaining")
                .classList.add(warning.color);
        } else {
            document
                .getElementById("base-timer-path-remaining")
                .classList.add(info.color);
        }
    }

    // function calculateTimeFraction() {
    //     const rawTimeFraction = timeLeft / TIME_LIMIT;
    //     return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
    // }

    // function setCircleDasharray() {
    //     const circleDasharray = `${(
    //         calculateTimeFraction() * FULL_DASH_ARRAY
    //     ).toFixed(0)} 283`;
    //     document
    //         .getElementById("base-timer-path-remaining")
    //         .setAttribute("stroke-dasharray", circleDasharray);
    // }
});
//End controller of Quiz Page

//End AngularJS