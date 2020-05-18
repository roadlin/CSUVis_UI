/*
 * @Author: Lin Xiaoru
 * @Date: 2020-05-11 18:45:58
 * @LastEditTime: 2020-05-17 17:29:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /va_module/src/App.js
 */
import React, { useState } from 'react'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import RiverEx from './examplePages/RiverExample'
import StrapEx from './examplePages/StrapExample'
import StackEx from './examplePages/StackExample'
import ScatterEx from './examplePages/ScatterExample'
import AreaEx from './examplePages/AreaExample'
import CompositeEx from './examplePages/CompositeExample'

import './App.css'

function App() {
    let urlInfo = window.location.href.split('/')
    const [activeItem, setActiveItem] = useState(`/${urlInfo[urlInfo.length - 1]}`)
    const navList = [{
        url: '/river',
        text: '流图模块示例'
    }, {
        url: '/strap',
        text: '频带图模块示例'
    }, {
        url: '/stack',
        text: '堆栈图模块示例'
    }, {
        url: '/scatter',
        text: '散点图模块示例'
    }, {
        url: '/area',
        text: '面积图模块示例'
    }, {
        url: '/composite',
        text: '复合图表模块示例'
    }]
    return <BrowserRouter>
        <div className = 'app'>
            <ul className = 'nav'>
                {navList.map((item, i) => <li
                    key = {i}
                    className = {item.url === activeItem ? 'active' : ''}
                    onClick = {() => setActiveItem(item.url)}
                >
                    <Link to={item.url}>{item.text}</Link>
                </li>)}
            </ul>
            <div className = 'content'>
                <Route path = '/river' component = {RiverEx}></Route>
                <Route path = '/strap' component = {StrapEx}></Route>
                <Route path = '/stack' component = {StackEx}></Route>
                <Route path = '/scatter' component = {ScatterEx}></Route>
                <Route path = '/area' component = {AreaEx}></Route>
                <Route path = '/composite' component = {CompositeEx}></Route>
            </div>
        </div>
    </BrowserRouter>
}

export default App