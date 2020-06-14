/*
 * @Author: your name
 * @Date: 2020-05-12 15:28:50
 * @LastEditTime: 2020-06-14 18:24:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /va_module/src/examplePages/CompositeExample.js
 */

/*
 * @Author: your name
 * @Date: 2020-05-12 15:27:51
 * @LastEditTime: 2020-05-12 21:30:52
 * @LastEditors: Please set LastEditors
 * @Description: 用于无线电背景下的散点图
 * @FilePath: /va_module/src/examplePages/ScatterExample.js
 */
import React, { useState } from 'react'
import { Scatter, River } from '../lib'

// import {data as clusterMock, updateData as updateScatter} from '../data/cluster'
import clusterMock from '../data/test/cluster'
import * as d3 from 'd3'

const width = 1600, height = 800, padding = [50, 30, 50, 80]

function ScatterTest({
    width,
    height,
    xDomain,
    yAxis,
    enbaleGeo,
    doSample,
    visualStyle,
    data
}) {
    const noises = data.filter(d => d.category === -1)
    const noisesDbmDomain = [d3.min(noises.map(d => d.dbm)), d3.max(noises.map(d => d.dbm))]
    const dataColor = visualStyle === 'noise' ? '#c2c2c2' : d => {
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
    const noiseColor = visualStyle === 'noise' ? d => d3.scaleSequential(d3.interpolateYlOrBr).domain(noisesDbmDomain)(d.dbm) : '#555'
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
            direction: yAxis.key === 'time' ? 'top' : 'bottom', 
            isShow: true
        }}
        yAxis = {{
            // key: 'band', 
            // tag: 'Band/dB', 
            // step: 500, 
            // domain: yDomain,
            ...yAxis,
            type: yAxis.key === 'time' ? 'date' : 'number', 
            formatFn: yAxis.key === 'time' ?  d => d3.timeFormat("%H:%M:%S")(d) : d => Number(d).toFixed(2), 
            scaleFn: yAxis.key === 'time' ? d3.scaleTime : d3.scaleLinear, 
            direction: 'left', 
            isShow: true
        }}
        enableZoom = {{
            x: true,
            y: false
        }}
        data = {data}
        noiseRule = {d => d.category === -1}
        noiseColor = {noiseColor}
        dataColor = {dataColor}
        doSampleNoise = {doSample}
        sampleFn = {noises => {
            let result = []
            let sampleInterval = 10
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

function RiverTest({
    width,
    height,
    xDomain,
    yDomain,
    bandDomain,                     // 2 元素数组
    leftDomain,                     // 3 元素数组
    rightDomain,                    // 3 元素数组
    data
}) {
    return (<River
        width = {width}
        height = {height}
        padding = {padding}
        xAxis = {{
            key: 'freq', 
            tag: 'Freq/Hz', 
            type: 'number', 
            step: '2', 
            domain: xDomain, 
            formatFn: d => d, 
            scaleFn: d3.scaleLinear, 
            direction: 'top', 
            isShow: true
        }}
        yAxis = {{
            key: 'time', 
            tag: 'Time/时分秒', 
            type: 'date', 
            step: 10, 
            domain: yDomain, 
            formatFn: d => d3.timeFormat("%H:%M:%S")(d), 
            scaleFn: d3.scaleTime, 
            direction: 'left', 
            isShow: true,
            thd: 1000
        }}
        band = {{
            key: 'band', 
            scale: d3.scaleLinear().domain(bandDomain).range([12, 80].map(d => d * 10 / (xDomain[1] - xDomain[0])))
        }}
        highlight = {{
            key: 'isNewSignal'
        }}
        leftPoly = {{
            key: 'dbm',  
            // scale: d3.scaleSequential(d3.scaleLinear()
            //         .domain(leftDomain)
            //           .range(['#3b7e9d', '#2cd4f9', '#c9fbfb'])),
            scale: value => {
                let ipColor =  d3.scaleLinear()
                    .domain(leftDomain)
                      .range(['#3b7e9d', '#2cd4f9', '#c9fbfb']);
                if((value > leftDomain[1]/2 && value < leftDomain[1]) || (value > (leftDomain[1]+leftDomain[2])/2 && value < leftDomain[2])) {
                    value += 20;
                } else {
                    value -= 5;
                }
                return d3.scaleSequential(ipColor)(value);
            },
            showLegend: true
        }}
        rightPoly = {{
            key: 'snr', 
            scale: d3.scaleSequential(d3.interpolate('#565656', '#b0b0b0', '#c2c2c2'))
                    .domain(rightDomain), 
            showLegend: true
        }}
        data = {data.filter(d => d.category !== -1)}
        formatConfig = {{
            meanKeys: ['freq', 'band', 'dbm', 'snr']
        }}
        enableZoom = {{
            x: true,
            y: false
        }}
        enableHover = {true}
        hoverHandle = {d => (`
            <p>流编号: ${d.isNewSignal ? 'un' : 'au'}${d.category}</p>
            <p>流中心: ${d.freq.toFixed(2)}</p>
            <p>左侧属性值: ${d.dbm.toFixed(2)}</p>
            <p>右侧属性值: ${d.snr.toFixed(2)}</p>
            <p>日期: ${d3.timeFormat("%Y-%m-%d")(new Date(d.time))}</p>
            <p>时间: ${d3.timeFormat("%H:%M:%S")(new Date(d.time))}</p>
        `)}
        enableBrush = {{
            x: true,
            y: true,
            cb: (xSection, ySection) => console.log(`选中\n freq 区间为\t${xSection}\n time 区间为\t${ySection}`)
        }}
    ></River>)
}

const App = function () {

    // const [data, setData] = useState(clusterMock)
    const data = clusterMock.filter(d => {
        return d.freq >= 944 && d.freq < 947.5
        // return d.freq >= 952 && d.freq < 954

    })
    const [enableGeo, setEnableGeo] = useState(false)
    const [doSample, setDoSample] = useState(true)

    const getDomain = (data, key) => {
        let vals = data.map(d => (d[key])).sort((a, b) => a - b)
        return [vals[0], vals[vals.length - 1]]
    }
    let bandRange = getDomain(data, 'band')
    let freqRange = getDomain(data, 'freq')
    let snrRange = getDomain(data, 'snr')
    let dbmRange = getDomain(data, 'dbm')
    let timeRange = getDomain(data, 'time')

    let xDomain = [Math.floor(freqRange[0]) - 1, Math.ceil(freqRange[1]) + 1]

    const [visualStyle, setVisualStyle] = useState('category')
    const [mode, setMode] = useState('river')
    const [yAxis, setYAxis] = useState({
        key: 'band', 
        tag: 'Band/dB', 
        step: 500, 
        domain: [bandRange[0] - 100, bandRange[1] + 100],
    })
    

    const selectYAxis = e => {
        switch(e.target.value) {
            case '0':
                setYAxis({
                    key: 'band', 
                    tag: 'Band/dB', 
                    step: 500, 
                    domain: [bandRange[0] - 200, bandRange[1] + 200],
                })
                break;
            case '1':
                setYAxis({
                    key: 'snr', 
                    tag: 'SNR/dB', 
                    step: 10, 
                    domain: [snrRange[0] - 10, snrRange[1] + 10],
                })
                break;
            case '2':
                setYAxis({
                    key: 'dbm', 
                    tag: 'STR/dBm', 
                    step: 10, 
                    domain: [dbmRange[0] - 10, dbmRange[1] + 10],
                })
                break;
            case '3':
                setYAxis({
                    key: 'time', 
                    tag: 'Time', 
                    step: 10, 
                    domain: [timeRange[0] - 5*1000, timeRange[1] + 5*1000],
                })
                break;
            default:
                setYAxis({
                    key: 'band', 
                    tag: 'Band/dB', 
                    step: 500, 
                    domain: [bandRange[0] - 200, bandRange[1] + 200],
                })
        }
    }
    const selectMode = e => {
        if(e.target.value === '0') {
            setMode('river')
        } else {
            setMode('scatter')
        }
    }
    const selectStyle = e => {
        switch(e.target.value) {
            case '0':
                setVisualStyle('category')
                setEnableGeo(false)
                setDoSample(true)
                break;
            case '1':
                setVisualStyle('category')
                setEnableGeo(true)
                setDoSample(true)
                break;
            case '2':
                setVisualStyle('noise')
                setEnableGeo(true)
                setDoSample(false)
                break;
            default:
                setVisualStyle('category')
                setEnableGeo(false)
                setDoSample(true)
        }
    }

    return <div className='app'>
        {/* <button onClick = {() => setData(updateScatter())}>更改数据集</button> */}
        <div>
            <span>Visual Mode: </span>
            <select onChange = {selectMode} defaultValue = {0} style={{marginRight: '10px'}}>
                <option value="0">River</option>
                <option value="1">Scatter</option>
            </select>
            {mode === 'scatter' && <>
                <span>Visual Style: </span>
                <select onChange = {selectStyle} defaultValue = {0} style={{marginRight: '10px'}}>
                    <option value="0">Full style</option>
                    <option value="1">Signal-oriented style</option>
                    <option value="2">Noise-oriented style</option>
                </select>
                <span>Y-Axis: </span>
                <select onChange = {selectYAxis} defaultValue = {0} style={{marginRight: '10px'}}>
                    <option value="0">Band</option>
                    <option value="1">SNR</option>
                    <option value="2">STR</option>
                    <option value="3">Time</option>
                </select>
            </>}
        </div>
        {mode === 'scatter' && <ScatterTest
            width = {width}
            height = {height}
            xDomain = {xDomain}
            yAxis = {yAxis}
            enbaleGeo = {enableGeo}
            doSample = {doSample}
            visualStyle = {visualStyle}
            data = {data}
        ></ScatterTest>}
        {mode === 'river' && <RiverTest
            width = {width}
            height = {height}
            xDomain = {xDomain}
            yDomain = {getDomain(data, 'time')}
            bandDomain = {getDomain(data, 'band')}                    
            leftDomain = {[0, -45, -100]}                   
            rightDomain = {[snrRange[0], (snrRange[0] + snrRange[1]) / 2 ,snrRange[1]]} 
            data = {data}                 
        ></RiverTest>}
    </div>
}

export default App