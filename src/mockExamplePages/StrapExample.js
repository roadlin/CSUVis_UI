/*
 * @Author: your name
 * @Date: 2020-05-11 21:13:42
 * @LastEditTime: 2020-05-15 21:03:57
 * @LastEditors: Please set LastEditors
 * @Description: 无线电背景下的态势频带图
 * @FilePath: /va_module/src/examplePages/StrapExample.js
 */
import React from 'react'
import { Strap } from '../lib'
import ExampleCreate from './ExampleCreate'

import {data as situationMock, updateData as updateStrap} from '../data/mock/situation'
import * as d3 from 'd3'

const width = 1300, height = 300, padding = [20, 10, 50, 100]
 
function EqualStrapTest({
    width,
    height,
    xDomain,
    yDomain,
    data
}) {
    return (<Strap
        width = {width}
        height = {height}
        padding = {padding}
        xAxis = {{
            key: 'freq', 
            tag: 'freq/Hz', 
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
            tag: 'time/年月日', 
            type: 'date', 
            step: 10, 
            domain: yDomain, 
            formatFn: d => d3.timeFormat("%H:%M:%S")(d), 
            scaleFn: d3.scaleTime, 
            direction: 'left', 
            isShow: true
        }}
        colorScale = {d => d3.scaleOrdinal().domain([1, 2, 3, 4, 5]).range(['#8ac836', '#ecf414', '#ffa200', '#ff786d', '#cb0f09'])(d.situation)}
        data = {data}
        enableHover = {true}
        enableZoom = {{x: true, y: false}}
        hoverHandle = {(x, y) => (`
            <p>Freq: ${x} MHz</p>
            <p>Time: ${y}</p>
        `)}
        enableBrush = {{
            x: true,
            y: false,
            cb: (xSection) => console.log(xSection)
        }}
    ></Strap>)
}

function LayerStrapTest({
    width,
    height,
    xDomain,
    yDomain,                // 3 元素数组
    data
}) {
    return (<Strap
        width = {width}
        height = {height}
        padding = {padding}
        xAxis = {{
            key: 'freq', 
            tag: 'freq/Hz', 
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
            tag: 'time/年月日', 
            type: 'date', 
            step: 10, 
            domain: yDomain,
            range: [height - padding[2], padding[0] + 50, padding[0]],
            tickValues: yDomain,
            formatFn: d => d3.timeFormat("%H:%M:%S")(d), 
            scaleFn: d3.scaleTime, 
            direction: 'left', 
            isShow: true
        }}
        colorScale = {d => d3.scaleOrdinal().domain([1, 2, 3, 4, 5]).range(['#8ac836', '#ecf414', '#ffa200', '#ff786d', '#cb0f09'])(d.situation)}
        data = {data}
        enableHover = {true}
        hoverHandle = {(x, y) => (`
            <p>Freq: ${x} MHz</p>
            <p>Time: ${y}</p>
        `)}
        enableBrush = {{
            x: true,
            y: false,
            cb: (xSection) => console.log(xSection)
        }}
    ></Strap>)
}

const Container = ExampleCreate(function ({
    width,
    height,
    data,
    getDomain
}) {
    const xDomain = getDomain(data, 'freq')
    const yDomain = getDomain(data, 'time')

    return (<div>
        <div className='title'>等距坐标轴</div>
        <EqualStrapTest
            width = {width}
            height = {height}
            xDomain = {xDomain}
            yDomain = {yDomain}
            data = {data}                 
        ></EqualStrapTest>
        <div className='title'>多层级坐标轴</div>
        <LayerStrapTest
            width = {width}
            height = {height}
            xDomain = {xDomain}
            yDomain = {[yDomain[0], yDomain[1] - 10*1000, yDomain[1]]}
            data = {data}                 
        ></LayerStrapTest>
    </div>)
})

const App = function () {
    return <Container
        width = {width}
        height = {height}
        mockData = {situationMock}
        title = '频带图示例'
        updateData = {updateStrap}
    ></Container>
}

export default App