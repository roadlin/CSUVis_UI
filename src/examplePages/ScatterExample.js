/*
 * @Author: your name
 * @Date: 2020-05-12 15:27:51
 * @LastEditTime: 2020-05-17 21:34:05
 * @LastEditors: Please set LastEditors
 * @Description: 用于无线电背景下的散点图
 * @FilePath: /va_module/src/examplePages/ScatterExample.js
 */
import React, { useState } from 'react'
import { Scatter } from '../lib'

// import {data as clusterMock, updateData as updateScatter} from '../data/cluster'
import clusterMock from '../data/test/cluster'
import * as d3 from 'd3'

const width = 1600, height = 800, padding = [50, 30, 50, 80]

function ScatterTest({
    width,
    height,
    xDomain,
    yDomain,
    enbaleGeo,
    data
}) {
    return (<Scatter
        width = {width}
        height = {height}
        padding = {padding}
        xAxis = {{
            key: 'freq', 
            tag: 'freq/Hz', 
            type: 'number', 
            step: '2', 
            domain: xDomain, 
            formatFn: d => Number(d).toFixed(2), 
            scaleFn: d3.scaleLinear, 
            direction: 'bottom', 
            isShow: true
        }}
        yAxis = {{
            key: 'band', 
            tag: 'Band/dB', 
            step: 500, 
            domain: yDomain,
            type: 'number', 
            formatFn: d => Number(d).toFixed(2), 
            scaleFn: d3.scaleLinear, 
            direction: 'left', 
            isShow: true
        }}
        enableZoom = {{
            x: true,
            y: false
        }}
        data = {data}
        noiseRule = {d => d.category === -1}
        noiseColor = {'#555'}
        dataColor = {
            // d => d3.scaleSequential(d3.interpolateSpectral)
            //         .domain([0, 25])(d.category)
            d => {
                if(d.isNewSignal) {                                      // 新信号颜色编码
                    return ['#ffe88c', '#f7b941', '#ffb78d'][d.category-24];
                  } else { 
                    let averageDbm = d.dbm;
                    let color;
                    if(averageDbm > -65) {
                      color = d3.scaleLinear()
                                    .domain([-65, -50, -40])
                                      .range(['#1cbaf4', '#2f93b0', '#3b7e9d']);
                    } else {
                      color = d3.scaleLinear()
                                    .domain([-90, -82, -74, -65])
                                      .range(['#8ec6dd', '#a7fffe', '#84e2ec', '#63dbf5']);
                    }
                    return d3.scaleSequential(color)(averageDbm);
                }
            }
        }
        doSampleNoise = {true}
        sampleFn = {noises => {
            let result = []
            let sampleInterval = 20
            let maxIndex = noises.length - 1
            if(maxIndex < sampleInterval) {
                return noises
            }
            for(let j = 0; j < noises.length; j += sampleInterval) {
                let randomNosieIndex = parseInt(Math.random()*(sampleInterval - 1)) + j
                let mean = noises[randomNosieIndex >= maxIndex ? maxIndex : randomNosieIndex]
                result.push(mean)
            }
            return result
        }}
        doGeoVis = {enbaleGeo}
        geoKey = {'category'}
        enableHover = {true}
        pointHoverHandle = {d => (`
            ${d.category !== -1 ? `<p>SignalID: ${d.isNewSignal ? 'un' : 'au'}${d.category}</p>` : '<p>Nosie</p>'} 
            <p>Freq: ${d.freq.toFixed(2)} MHz</p>
            <p>STR: ${d.dbm.toFixed(2)} dBm</p>
            <p>SNR: ${d.snr.toFixed(2)} dB</p>
            <p>Date: ${d3.timeFormat("%Y-%m-%d")(new Date(d.time))}</p>
            <p>Time: ${d3.timeFormat("%H:%M:%S")(new Date(d.time))}</p>
        `)}
        geoHoverHandle = {d => (`
            <p>SignalID: ${d[0].isNewSignal ? 'un' : 'au'}${d[0].category}</p>
            <p>SFV Number: ${d.length}</p>
        `)}
    ></Scatter>)
}

const App = function () {
    // const [data, setData] = useState(clusterMock)
    const data = clusterMock.filter(d => {
        return d.time >= new Date('2016-04-07 15:16:08').getTime() && d.time < new Date('2016-04-07 15:16:38').getTime()
    })
    const [enableGeo, setEnableGeo] = useState(false)
    const getDomain = (data, key) => {
        let vals = data.map(d => (d[key])).sort((a, b) => a - b)
        return [vals[0], vals[vals.length - 1]]
    }

    let bandRange = getDomain(data, 'band')
    let freqRange = getDomain(data, 'freq')
    let xDomain = [freqRange[0] - 2, freqRange[1] + 2]
    let yDomain = [bandRange[0] - 200, bandRange[1] + 200]

    return <div className='app'>
        {/* <button onClick = {() => setData(updateScatter())}>更改数据集</button> */}
        <button onClick = {() => setEnableGeo(!enableGeo)}>切换模式</button>

        <ScatterTest
            width = {width}
            height = {height}
            xDomain = {xDomain}
            yDomain = {yDomain}
            enbaleGeo = {enableGeo}
            data = {clusterMock}
        ></ScatterTest>
    </div>
}

export default App