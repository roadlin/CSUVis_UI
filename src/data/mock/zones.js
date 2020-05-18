/*
 * @Author: your name
 * @Date: 2020-04-28 21:42:11
 * @LastEditTime: 2020-05-12 19:09:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /va_module/src/data/stack.js
 */
const createData = (timeStart) => {
    let dataNum = 360
    let from = new Date(timeStart).getTime()
    let data = []
    let staticLowerData = []
    let staticHigherData = []


    for (let i = 0; i < dataNum; i++) {
        let unitData = {
            time: from + (5 * 60 * 1000) * i
        }
        for(let j = 1; j < 22; j++) {
            unitData[`zone${j}`] = Math.round(Math.random() * 5)
        }
        data.push(unitData)
    }

    from = from + (3 * 3600 * 1000)
    for (let i = 0; i < dataNum / 36 - 1; i++) {
        let lowerUnitData = {
            time: from + (3 * 3600 * 1000) * i,
            preheating: Math.round(Math.random() * 27),
            firing: Math.round(Math.random() * 27),
            cooling: Math.round(Math.random() * 18)
        }    
        let higherUnitData = {
            time: from + (3 * 3600 * 1000) * i,
            preheating: Math.round(Math.random() * 27),
            firing: Math.round(Math.random() * 27),
            cooling: Math.round(Math.random() * 18)
        }    
        staticLowerData.push(lowerUnitData)
        staticHigherData.push(higherUnitData)
    }
    return {
        data,
        staticLowerData,
        staticHigherData
    }
}

const initData = createData('2016-12-18 14:21')
export {
    initData as data,
    createData
}


