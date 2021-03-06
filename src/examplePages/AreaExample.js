/*
 * @Author: your name
 * @Date: 2020-05-12 15:28:01
 * @LastEditTime: 2020-06-14 18:03:34
 * @LastEditors: Please set LastEditors
 * @Description: 应用于辊道窑背景下的多层次面积图
 * @FilePath: /va_module/src/examplePages/areaExample.js
 */

import React, { useState } from 'react'
import { MultiArea } from '../lib'
import MultiAreaStep from '../area'

// import {data as temperatureMock, updateData as updateRiver} from '../data/temperature'
import temperatureMock from '../data/test/temperature'
import * as d3 from 'd3'

const width = 1500, height = 300, padding = [10, 50, 50, 50]

function AreaTest({
    width,
    height,
    xDomain,
    levels,
    setting,
    data
}) {
    return (<MultiArea
        // 视图的宽高及四周（上右下左）留白
        width = {width}
        height = {height}
        padding = {padding}
        // x 轴配置信息
        xAxis = {{
            // 编码属性
            key: 'time', 
            // 末尾显示的提示信息
            tag: '', 
            // 该属性类型，支持 number / date
            type: 'date', 
            // 刻度间隔，为 type 为 date 时该值单位为“秒”
            step: 5 * 60, 
            // 定义域
            domain: xDomain, 
            // 刻度值格式化函数，无需格式化时请输入 d => d
            formatFn: d => d3.timeFormat("%H:%M")(d), 
            // 比例尺类型，传入 d3 的比例尺函数
            scaleFn: d3.scaleTime, 
            // 刻度布局方向，支持 top/bottom/left/right
            direction: 'bottom', 
            // 是否显示该坐标轴
            isShow: true,
            // 是否延长刻度线，分割视图，默认值为 false
            // showGrid: false,
            // 是否显示坐标轴标尺线，默认值为 true
            // showPath: true
        }}
        // y 轴配置信息，支持双坐标，每一个元素配置信息基本同 x 轴配置
        yAxis = {[{
            key: 'current', 
            tag: '', 
            type: 'number', 
            step: 50, 
            domain: [0, 150], 
            formatFn: d => d, 
            scaleFn: d3.scaleLinear, 
            direction: 'left', 
            isShow: true,
            showGrid: true
        }, {
            key: 'voltage', 
            tag: '', 
            type: 'number', 
            step: 150, 
            domain: [0, 450], 
            formatFn: d => d, 
            scaleFn: d3.scaleLinear, 
            direction: 'right', 
            isShow: true,
            showGrid: true
        }]}
        // 面积编码配置
        areaConfig = {{
            // 编码的属性
            key: 'temperature',
            // 分级阈值，7 元素数组
            // 用于分割 lower_3 - lower_2 - lower_1 - 标准值 - higher_1 - higher_2 - higher_3
            levels: levels,
            // 设定值
            setting: setting,
            // 颜色编码
            colorMap: {
                // 高于设定值的颜色等级，偏差
                higher: ['#FCDAD5', '#EE7C6B', '#DF0029'],
                // 低于设定值的颜色等级
                lower: ['#D1E5F0', '#67A9CF', '#2166AC']
            }
        }}
        // 展示数据
        data = {data}
    ></MultiArea>)
}

function AreaStep({
    width,
    height,
    xDomain,
    levels,
    setting,
    type,
    data
}) {
    return (<MultiAreaStep
        // 视图的宽高及四周（上右下左）留白
        width = {width}
        height = {height + padding[0] + padding[2]}
        padding = {padding}
        type = {type}
        // x 轴配置信息
        xAxis = {{
            key: 'time', 
            tag: '', 
            type: 'date', 
            step: 5 * 60, 
            domain: xDomain, 
            formatFn: d => d3.timeFormat("%H:%M")(d), 
            scaleFn: d3.scaleTime, 
            direction: 'bottom', 
            isShow: true,
        }}
        // y 轴配置信息，支持双坐标，每一个元素配置信息基本同 x 轴配置
        yAxis = {[{
            key: 'current', 
            tag: ' ', 
            type: 'number', 
            step: 150, 
            domain: [0, 150], 
            formatFn: d => d, 
            scaleFn: d3.scaleLinear, 
            direction: 'left', 
            isShow: true,
        }, {
            key: 'voltage', 
            tag: ' ', 
            type: 'number', 
            step: 450, 
            domain: [0, 450], 
            formatFn: d => d, 
            scaleFn: d3.scaleLinear, 
            direction: 'right', 
            isShow: true,
        }]}
        // 面积编码配置
        areaConfig = {{
            key: 'temperature',
            levels: levels,
            setting: setting,
            colorMap: {
                higher: ['#FCDAD5', '#EE7C6B', '#DF0029'],
                lower: ['#D1E5F0', '#67A9CF', '#2166AC']
            }
        }}
        // 展示数据
        data = {data}
    ></MultiAreaStep>)
}

const App = function () {
    const [dataIndex, setDataIndex] = useState(1)
    const [data, setData] = useState(temperatureMock.sensorTopData)
    const getDomain = (data, key) => {
        let vals = data.map(d => (d[key])).sort((a, b) => a - b)
        return [vals[0], vals[vals.length - 1]]
    }
    const xDomain = getDomain(temperatureMock.sensorTopData.concat(temperatureMock.sensorBottomData), 'time')
    const stepAreaHeight = 120
    const Area = ({type, height}) => (<AreaStep
        width = {width}
        height = {height}
        xDomain = {xDomain}
        levels = {[-30, -20, -10, 0, 10, 20, 30]}
        setting = {360}         
        data = {data}
        type = {type}    
    ></AreaStep>)
    
    return <div style={{width: `${width}px`, margin: '0 auto'}}>
        <button onClick = {() => {setData(temperatureMock.sensorTopData); setDataIndex(1)}}>测试数据1</button>
        <button onClick = {() => {setData(temperatureMock.sensorBottomData); setDataIndex(2)}}>测试数据2</button>
        <div style = {{marginTop: '20px', marginLeft: '5px'}}>当前数据集：测试数据{dataIndex}</div>
        <AreaTest
            width = {width}
            height = {height}
            xDomain = {xDomain}
            levels = {[-30, -20, -10, 0, 10, 20, 30]}
            setting = {360}         
            data = {data}  
        ></AreaTest>
        <h4>绘图步骤：</h4>
        <p>步骤1：</p>
        <Area type={'layer'} height={6*stepAreaHeight}></Area>
        <p>步骤2：</p>
        <Area type={'overlay'} height={2*stepAreaHeight}></Area>
        <p>步骤3：</p>
        <Area type={'skew'} height={stepAreaHeight}></Area>
    </div>
}
export default App