/*
 * @Author: your name
 * @Date: 2020-04-24 10:08:45
 * @LastEditTime: 2020-05-11 21:57:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /va_module/src/data/situation.js
 */

let dataNum = 15
let timeStart = new Date('2016-04-07 15:16:08').getTime()
let time = timeStart
let timeStep = 10 * 1000
let freqStep = 1

let freqRange = [936, 962]

let data = []

const createDataPoint = (time) => {
    let dataPoints = []
    for(let j = freqRange[0]; j < freqRange[1]; j += freqStep) {
        dataPoints.push({
            time,
            freq: j,
            situation: Math.floor(Math.random() * 4 + 1)
        })
    }
    return dataPoints
}

const updateData = () => {
    data = data.filter(d => d.time - timeStart !== 0)
    timeStart += timeStep
    data.push(...createDataPoint(time))
    time += timeStep
    return data;
}

for(let i = 0; i < dataNum; i++) {
    let dataPoints = createDataPoint(time)
    data.push(...dataPoints)
    time += timeStep
}
// console.log(situations)


export {
    data,
    updateData
}