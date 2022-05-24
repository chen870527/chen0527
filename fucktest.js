const p1 = Promise.resolve(3)
const p2 = 1998
const p3 = new Promise((resolve,reject) => {
    setTimeout(() => reject('foo'),1000)
})

Promise.all([p1,p2,p3])
    .then(value => {
        console.log(value)
    })
    .catch(err => {
        console.log(err.message)
    })