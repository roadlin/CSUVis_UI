/*
 * @Author: your name
 * @Date: 2020-05-09 09:34:07
 * @LastEditTime: 2020-05-12 19:07:47
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /va_module/src/data/temperature.js
 */
let sensorData = []
let num = 30
let from = new Date('2020-05-03 12:18:00').getTime()
let startTime = from
let step = 5 * 60 * 1000
let setting = 700

for (let i = 0; i < num; i++) {
    sensorData.push({
        time: from,
        current: (Math.random() * 150).toFixed(2),
        voltage: (Math.random() * 450).toFixed(2),
        temperature: setting + (Math.random() * 80 - 40)
    })
    from += step
}

const updateData = () => {
    sensorData = sensorData.filter(d => d.time - startTime !== 0)
    startTime += step
    sensorData.push({
        time: from,
        current: (Math.random() * 150).toFixed(2),
        voltage: (Math.random() * 450).toFixed(2),
        temperature: setting + (Math.random() * 80 - 40)
    }) 
    from += step
    return sensorData;
}

export {
    sensorData as data,
    updateData
}