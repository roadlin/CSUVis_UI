/*
 * @Author: your name
 * @Date: 2020-05-12 15:27:32
 * @LastEditTime: 2020-05-16 16:33:23
 * @LastEditors: Please set LastEditors
 * @Description: 用于辊道窑背景下的堆栈图示例
 * @FilePath: /va_module/src/examplePages/StackExample.js
 */

import React, { useState } from 'react'
import { Stack } from '../lib'

import {data as zoneMock, createData as updateStack} from '../data/mock/zones'
import * as d3 from 'd3'

const width = 1300, height = 400

function StackTest({
    width,
    height,
    xDomain,
    topBeadsData,
    bottomBeadsData,
    data
}) {
    return (<Stack
        width = {width}
        height = {height}
        padding = {[10, 50, 50, 50]}
        xAxis = {{
            key: 'time', 
            tag: '', 
            type: 'date', 
            step: 3 * 60 * 60, 
            domain: xDomain, 
            formatFn: d => d3.timeFormat("%m-%d %H:%M")(d), 
            scaleFn: d3.scaleTime, 
            direction: 'bottom', 
            isShow: true,
            showGrid: true,
            showPath: false,
            holdTicks: true
        }}
        keyword = 'zone'
        beadConfig = {{
            colorMap: {
                preheating: '#F6D6A8',
                firing: '#CDE4C5',
                cooling: '#EEB2AC'
            },
            height: 50,
            widthScale: d3.scaleLinear().domain([0, d3.max(topBeadsData.concat(topBeadsData), d => Math.max(d.preheating, d.firing, d.cooling))]).range([8, 15]),
            topBeadsData: topBeadsData,
            bottomBeadsData: bottomBeadsData,
        }}
        stackColorScale = {d => d3.scaleOrdinal().domain([1, 2, 3, 4, 5]).range(['#A7D898', '#FFFF99', '#F5B06D', '#F44545', '#C21D7A'])(d)}
        strokeColorMap = {key => {
            let index = key.slice(key.indexOf('zone') + 4)
            return index < 10 ? '#F6D6A8' : index < 19 ? '#CDE4C5' : '#EEB2AC'
        }}
        stackData = {data}
        enableZoom = {{x: true, y: false}}
        enableHover = {false}
        enableBrush = {{
            x: true,
            y: false,
            cb: (xSelection) => console.log(`选中了：${xSelection}`)
        }}
    ></Stack>)
}

const App = function () {
    const [data, setData] = useState(zoneMock)
    const getDomain = (data, key) => {
        let vals = data.map(d => (d[key])).sort((a, b) => a - b)
        return [vals[0], vals[vals.length - 1]]
    }

    const changeData = () => {
        const startTimeRange = [new Date('2020-01-25 10:00:00').getTime(), new Date('2020-05-20 23:00:00').getTime()]
        const random = Math.floor(Math.random() * (startTimeRange[1] - startTimeRange[0]) + startTimeRange[0])
        return updateStack(random)
    }

    return <div className='canvas'>
        <button onClick = {() => setData(changeData())}>更改数据集</button>
        <StackTest
            width = {width}
            height = {height}
            xDomain = {getDomain(data.data, 'time')}
            topBeadsData = {data.staticHigherData}
            bottomBeadsData = {data.staticLowerData}
            data = {data.data}
        ></StackTest>
    </div>
}

export default App