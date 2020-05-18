/*
 * @Author: your name
 * @Date: 2020-05-17 14:50:04
 * @LastEditTime: 2020-05-17 16:30:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /test/src/data/test/situation.js
 */ 
let timeStart = new Date('2016-04-07 15:16:08').getTime()
let timeStep = 10 * 1000
let freqStep = 1
let data = []
let situation = [
    [1,1,1,1,1,1,2,1,1,2,1,2,2,2,2,1,1,2,1,2,2,2,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,2,1,2,2,2,2,1,1,2,1,2,2,2,1,1,1,1,1,1,1,1],
    [1,1,1,2,1,1,1,1,1,2,1,2,2,2,2,1,1,2,1,2,2,2,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,2,1,2,2,2,2,1,1,2,1,2,2,2,1,1,1,1,1,1,1,1],
    [1,1,1,1,2,2,2,1,1,2,1,2,2,2,2,1,1,2,2,2,2,2,1,1,1,1,1,1,1,1],
    [1,1,1,2,2,2,2,1,1,2,1,2,2,2,3,1,1,2,2,2,2,2,1,1,1,2,1,1,1,1],
    [1,1,1,2,1,2,2,2,1,2,1,2,2,2,3,1,1,1,2,2,2,2,1,1,1,2,1,1,1,1],
    [1,1,1,2,2,1,2,2,1,2,1,2,2,2,2,1,1,2,1,2,2,2,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,2,1,2,1,2,2,2,2,1,1,1,1,2,2,2,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,2,1,2,2,2,2,1,1,1,1,2,2,3,1,1,1,1,1,1,1,1],
    [1,1,1,2,1,1,2,2,1,2,1,2,2,2,2,1,1,2,1,2,1,2,1,1,1,1,1,1,1,1],
    [1,1,1,2,1,1,2,2,1,2,1,2,2,2,2,1,1,2,1,2,2,2,1,1,1,1,1,1,1,1]
]
for(let i = 0; i < situation.length; i++) {
    let time = timeStart + timeStep * i
    for(let j = 0; j < situation[i].length; j++) {
        let freq = 932 + freqStep * j
        data.push({
            time,
            freq,
            situation: situation[i][j]
        })
    }
}
export default data