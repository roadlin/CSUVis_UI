/*
 * @Author: your name
 * @Date: 2020-04-27 11:24:26
 * @LastEditTime: 2020-06-14 18:21:59
 * @LastEditors: Please set LastEditors
 * @Description: 用于无线电背景下的流图示例
 * @FilePath: /va_module/src/AppTest.js
 */
import React from 'react'
import { River } from '../lib'
import clusterMock from '../data/test/cluster'
import * as d3 from 'd3'

const width = 1600, height = 800

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
        padding = {[50, 30, 50, 80]}
        xAxis = {{
            key: 'freq', 
            tag: '', 
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
            tag: 'Time', 
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
            scale: d3.scaleLinear().domain(bandDomain).range([12, 80])
        }}
        highlight = {{
            key: 'isNewSignal'
        }}
        leftPoly = {{
            key: 'dbm',  
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
            cb: (xSection, ySection) => console.log(`选中\n x轴 区间为\t${xSection}\n y轴 区间为\t${ySection}`)
        }}
    ></River>)
}

const App = function () {
    const data = clusterMock
    const getDomain = (data, key) => {
        let vals = data.map(d => (d[key])).sort((a, b) => a - b)
        return [vals[0], vals[vals.length - 1]]
    }
    const snrDomain = getDomain(data, 'snr')
    const snrOffset = 8
    return (<RiverTest
        width = {width}
        height = {height}
        xDomain = {[932, 964]}
        yDomain = {getDomain(data, 'time')}
        bandDomain = {getDomain(data, 'band')}                    
        leftDomain = {[0, -45, -100]}                   
        rightDomain = {[snrDomain[1] + snrOffset, (snrDomain[0] + snrDomain[1]) / 2, snrDomain[0] - snrOffset]} 
        data = {data}                 
    ></RiverTest>)
}

export default App