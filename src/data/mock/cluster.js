let categoryNum = 23
let dataNum = 20
let timeStart = new Date('2016-04-07 15:16:08').getTime()
let time = timeStart
let step = 1 * 1000

let dbmRange = [-99, 0]
let snrRange = [0, 80]
let bandRange = [0, 4200]
let freqRange = [934, 962]

let data = []

const categoryConfig = (new Array(categoryNum)).fill(1).map((c, i) => ({
    category: i,
    isNewSignal: Math.random() < 0.1,
    freq: Math.random() * (freqRange[1] - freqRange[0]) + freqRange[0]
}))

const createDataPoint = (categoryIndex) => {
    let doCollect = Math.random() > 0.2
    let data = []
    if(doCollect) {
        let pointNum = Math.random() * 5
        for(let k = 0; k < pointNum; k ++) {
            let snr = Math.random() * (snrRange[1] - snrRange[0]) + snrRange[0]
            let band = Math.random() * (bandRange[1] - bandRange[0]) + bandRange[0]
            let dbm = Math.random() * (dbmRange[1] - dbmRange[0]) + dbmRange[0]
            data.push({
                category: categoryConfig[categoryIndex].category,
                time: time,
                freq: categoryConfig[categoryIndex].freq + Math.random(),
                isnewsignal: categoryConfig[categoryIndex].isNewSignal,
                snr,
                band,
                dbm
            })
        }
        let noiseNum = Math.floor(Math.random() * 2)
        for(let k = 0; k < noiseNum; k ++) {
            let snr = Math.random() * (snrRange[1] - snrRange[0]) + snrRange[0]
            let band = Math.random() * (bandRange[1] - bandRange[0]) + bandRange[0]
            let dbm = Math.random() * (dbmRange[1] - dbmRange[0]) + dbmRange[0]
            data.push({
                category: -1,
                time: time,
                freq: categoryConfig[categoryIndex].freq + Math.random(),
                isnewsignal: false,
                snr,
                band,
                dbm
            })
        }
    }
    return data
}

for (let i = 0; i < dataNum; i++) {
    for(let j = 0; j < categoryNum; j++) {
        data.push(...createDataPoint(j))
    }
    time += step
}

const updateData = () => {
    data = data.filter(d => d.time - timeStart !== 0)
    timeStart += step
    for(let j = 0; j < categoryNum; j++) {
        data.push(...createDataPoint(j))
    }
    time += step
    return data;
}

export {
    data,
    updateData
}
