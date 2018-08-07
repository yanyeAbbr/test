function task1() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(99)
        },2000)
    })
}

function task2() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(199)
        },2000)
    })
}
function task3() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(399)
        },2000)
    })
}
function task4() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(499)
        },3000)
    })
}
var date = Date.now();
Promise
    .all([task1(),task2(),task3(),task4()])
    .then(function (value) {
        console.log(value, Date.now() - date)
    })
    .catch(function (err) {
        console.log(err)
    });