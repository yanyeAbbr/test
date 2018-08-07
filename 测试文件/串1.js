function task1() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(99999)
        },1000)
    })
}
function task2(value) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(value * 2)
        },1000)
    })
}
function task3(value) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            // reject(new Error('错误'))
            resolve(value * 2)
        },1000)
    })
}
function task4(value) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(value * 2)
        },1000)
    })
}
var date = Date.now()
Promise.resolve()
    .then(task1)
    .then(task2)
    .then(task3)
    .then(task4)
    .then(function (value) {
        console.log(value, '>>>>>>>>>>','耗时:', Date.now() - date)
    })
    .catch(function (err) {
        console.error(err, '<<<<<<<<','耗时:', Date.now() - date)
    });



