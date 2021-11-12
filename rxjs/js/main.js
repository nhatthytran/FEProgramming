// function timeout(miliseconds){
//     return new Promise((success) => {
//         setTimeout(() => {
//             success('Data')
//         }, miliseconds);
//     })
// }

// timeout(1000)
//     .then((data) =>{
//         console.log('data', data)
//     }
// )
/*               RXJS            */

// Producer: sang tao noi dung
// Consumer: xem video
/* 
    Xay dung Observable voiws timeout vaf interval
*/
Promise.timeout = function(miliseconds){
    return new Promise((resolve) => {
        console.log('Kich hoat hay chua')
        setTimeout(() => {
            resolve()
        }, miliseconds);
    })
}

// const promiseObj = Promise.timeout(1000) // Eager

// promiseObj.then(() => {
//     console.log('timeout run')
// })

function Observable(){
    
}

Observable.timeout = function(miliseconds){
    return new Observable()
}

const obsTimeouts = Observable.timeout(1000)

console.log(obsTimeouts)