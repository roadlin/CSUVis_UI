/* eslint-disable no-fallthrough */
/*
 * @Author: your name
 * @Date: 2020-05-05 11:05:04
 * @LastEditTime: 2020-06-14 17:37:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /va_module/src/components/area/index.js
 */
import React, { useEffect, useState } from 'react'
import VASvgCreate from '../lib/VASvgCreateDoubleAxes.js'
import * as d3 from 'd3'
import './index.css'

// const CIRCLE_RADIUS = 2.5
// const TRIANGLE_OFFSET = 3

const MultiArea = ({
    height,
    padding,
    xAxis,
    yAxis,
    areaConfig,
    data,
    type,
    ...props
}) => {
    const [higherData, setHigherData] = useState([])
    const [lowerData, setLowerData] = useState([])

    // const [circleLineData, setCircleLineData] = useState([])
    // const [triangleLineData, setTriangleLineData] = useState([])

    let thds = areaConfig.levels
    let canvasHeight = height - padding[0] - padding[2]
    let setting = areaConfig.setting

    // 数据预处理：根据阈值切分数据
    useEffect(() => {
        let lower = [], higher = []
        for (let i = 0; i < data.length; i++) {
            let diff = data[i][areaConfig.key] - setting
            let element = {
                [xAxis.key]: data[i][xAxis.key],
                lower3: 0,
                lower2: 0,
                lower1: 0,
                higher3: 0,
                higher2: 0,
                higher1: 0
            }
            // levels: [-30, -20, -10, 0, 10, 20, 30]
            if(diff < 0) {
                /* 
                    比如配置 levels = [-30, -20, -10, 0, 10, 20, 30]
                    某一采集数据偏差为 -25，则应该存储为 3 段：
                    在 [-30, -20) 区间存储 -5
                    在 [-20, -10) 区间存储 -10
                    在 [-10, 0) 区间存储 -10
                */
                if(diff < thds[0]) {
                    element.lower3 = thds[0] - thds[1]
                    element.lower2 = thds[1] - thds[2]
                    element.lower1 = thds[2] - thds[3]
                } else if (diff < thds[1]) {
                    element.lower3 = diff - thds[1]
                    element.lower2 = thds[1] - thds[2]
                    element.lower1 = thds[2] - thds[3]
                } else if (diff < thds[2]) {
                    element.lower2 = diff - thds[2]
                    element.lower1 = thds[2] - thds[3]
                } else {
                    element.lower1 = diff - thds[3]
                }
                // element.lower3 = diff < thds[1] ? Math.max(diff - thds[1], thds[0] - thds[1]) : 0
                // element.lower2 = diff < thds[2] ? Math.max(diff - thds[2], thds[1] - thds[2]) : 0
                // element.lower1 = diff < thds[3] ? Math.max(diff - thds[3], thds[2] - thds[3]) : 0
            } else {
                // element.higher3 = diff > thds[5] ? Math.min(thds[6] - diff, thds[6] - thds[5]) : 0
                // element.higher2 = diff > thds[4] ? Math.min(thds[5] - diff, thds[5] - thds[4]) : 0
                // element.higher1 = diff > thds[3] ? Math.min(thds[4] - diff, thds[4] - thds[3]) : 0
                if(diff > thds[6]) {
                    element.higher3 = thds[6] - thds[5]
                    element.higher2 = thds[5] - thds[4]
                    element.higher1 = thds[4] - thds[3]
                } else if (diff > thds[5]) {
                    element.higher3 = diff - thds[5]
                    element.higher2 = thds[5] - thds[4]
                    element.higher1 = thds[4] - thds[3]
                } else if (diff > thds[4]) {
                    element.higher2 = diff - thds[4]
                    element.higher1 = thds[4] - thds[3]
                } else {
                    element.higher1 = diff - thds[3]
                }
            }
            lower.push(element)
            higher.push(element)
        }
        setHigherData(higher)
        setLowerData(lower)
    }, [areaConfig.key, data, setting, thds, xAxis.key])
    // 比例尺
    // const circleLineScale = yAxis[0].scale
    // const triangleLineScale = yAxis[1].scale
    const xScale = xAxis.scale

    // const lineDecorator = scale => d3.line()
    //     .curve(d3.curveMonotoneX)
    //     .x(xScale)
    //     .y(scale)
    const getSeries = (data, keys) => d3.stack().keys(keys)(data)
    const getScale = (domain, range) => d3.scaleLinear().domain(domain).range(range)
    const areaDecorator = (yScale, type, y0) => d3.area()
                    .x(d => xScale(type === 'layer' ? d.data : d))
                    .y1(d => yScale(type === 'layer' ? d[1] : d.val))
                    .y0(d => type === 'layer' ? yScale(d[0]) : y0)
                    .curve(d3.curveBasis)
    
    let lowerSeries = getSeries(lowerData, ['lower1', 'lower2', 'lower3'])
    let higherSeries = getSeries(higherData, ['higher1', 'higher2', 'higher3'])
    let higherRange = [], higherDomains = [], higherY0 = 0,
        lowerRange = [], lowerDomains = [], lowerY0 = 0
    switch (type) {
        case 'layer':
            higherDomains = [[thds[3], thds[6]], [thds[3], thds[6]], [thds[3], thds[6]]]
            lowerDomains = [[thds[0], thds[3]], [thds[0], thds[3]], [thds[0], thds[3]]]
            higherRange = [canvasHeight/2, 0]
            lowerRange = [canvasHeight, canvasHeight/2]
            break;
        case 'overlay':
            let fullHeight = canvasHeight / 2
            higherDomains = [[0, thds[4]-thds[3]], [0, thds[5]-thds[4]], [0, thds[6]-thds[5]]]
            lowerDomains = [[0, thds[2]-thds[3]], [0, thds[1]-thds[2]], [0, thds[0]-thds[1]]]
            higherRange = [fullHeight, 0]
            lowerRange = [fullHeight, canvasHeight]
            higherY0 = fullHeight
            lowerY0 = fullHeight
            break;
        case 'skew':
        default:
            higherDomains = [[0, thds[4]-thds[3]], [0, thds[5]-thds[4]], [0, thds[6]-thds[5]]]
            lowerDomains = [[0, thds[2]-thds[3]], [0, thds[1]-thds[2]], [0, thds[0]-thds[1]]]
            higherRange = [canvasHeight, 0]
            lowerRange = [0, canvasHeight]
            higherY0 = canvasHeight
            lowerY0 = 0
            break;
    }

    return (<>
        <g className='area'>
            <g className='lowerArea'>
                {lowerSeries.map((series, i) => {
                    let key = series.key
                    series = type === 'layer' ? series : series.map(d => ({
                        [xAxis.key]: d.data[xAxis.key],
                        val: d.data[series.key]
                    }))
                    return <path
                        key = {key}
                        className = {`area_${key}`}
                        fill = {areaConfig.colorMap.lower[i]}
                        d = {areaDecorator(getScale(lowerDomains[i], lowerRange), type, lowerY0)(series)}
                    ></path>
                })}
            </g>
            <g className='higherArea'>
                {higherSeries.map((series, i) => {
                    let key = series.key
                    series = type === 'layer' ? series : series.map(d => ({
                        [xAxis.key]: d.data[xAxis.key],
                        val: d.data[series.key]
                    }))
                    return <path
                        key = {key}
                        className = {`area_${key}`}
                        fill = {areaConfig.colorMap.higher[i]}
                        d = {areaDecorator(getScale(higherDomains[i], higherRange), type, higherY0)(series)}
                    ></path>
                })}
            </g>
        </g>
        {/* <g>
            <g className='circleLine'>
                <path className='line' d={lineDecorator(circleLineScale)(data)}></path>
                {data.map(d => (<circle 
                    className = 'dot'
                    key = {d.time}
                    cx = {xScale(d)}
                    cy = {circleLineScale(d)}
                    r = {CIRCLE_RADIUS}
                ></circle>))}
            </g>
            <g className='triangleLine'>
                <path className='line' d={lineDecorator(triangleLineScale)(data)}></path>
                {data.map(d => {
                    let x = xScale(d)
                    let y = triangleLineScale(d)
                    return <path 
                        className = 'dot'
                        key = {d.time}
                        d = {`M${x - 3} ${y + TRIANGLE_OFFSET} L${x + 3} ${y + TRIANGLE_OFFSET} L${x} ${y - TRIANGLE_OFFSET}Z`}
                    ></path>        
                })}
            </g>
        </g> */}
    </>)
}

export default VASvgCreate(MultiArea, 'areaViewBox')