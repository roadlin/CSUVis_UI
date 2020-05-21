/*
 * @Author: Lin Xiaoru
 * @Date: 2020-05-11 18:45:58
 * @LastEditTime: 2020-05-20 18:48:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /va_module/src/App.js
 */
import React, { useState } from 'react'
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom'
import asyncImport from './AsyncComponent'
import './App.css'

function App() {
    const [activeItem, setActiveItem] = useState(0)
    const navList = [{
        url: '/river',
        text: '多维时变河流图',
        component: () => import('./examplePages/RiverExample')
    }, {
        url: '/strap',
        text: '短期单变量态势演化图',
        component: () => import('./examplePages/StrapExample')
    }, {
        url: '/stack',
        text: '长期多变量态势演化图',
        component: () => import('./examplePages/StackExample')
    }, {
        url: '/scatter',
        text: '多模式聚类分析图',
        component: () => import('./examplePages/ScatterExample')
    }, {
        url: '/area',
        text: '多变量时序图',
        component: () => import('./examplePages/AreaExample')
    }, 
    // {
    //     url: '/composite',
    //     text: '复合图表模块示例',
    //     component: () => import('./examplePages/CompositeExample')
    // }
    ]
    return <BrowserRouter>
        <div className = 'app'>
            <ul className = 'nav'>
                {navList.map((item, i) => <li
                    key = {i}
                    className = {i === activeItem ? 'active' : ''}
                    onClick = {() => setActiveItem(i)}
                >
                    <Link to={item.url}>{item.text}</Link>
                </li>)}
            </ul>
            <div className = 'content'>
                {navList.map((item, i) => (<Route 
                    key = {i}
                    path = {item.url} 
                    component = {asyncImport(item.component)}>    
                </Route>))}
                <Redirect from='/' to='/river'></Redirect>
            </div>
        </div>
    </BrowserRouter>
}

export default App