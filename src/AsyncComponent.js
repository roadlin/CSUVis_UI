/*
 * @Author: your name
 * @Date: 2020-05-20 10:13:28
 * @LastEditTime: 2020-05-20 21:11:07
 * @LastEditors: Please set LastEditors
 * @Description: 动态加载路由
 * @FilePath: /CSUVis_UI/src/AsyncComponent.js
 */ 
import React, { useState, useEffect } from 'react'

const asyncImportComponent = function (importComp) {
    function AsyncComponent(props) {
        const [Comp, setComp] = useState(null)
        useEffect(() => {
            async function fetchComponent () {
                try {
                    const { default: importComponent } = await importComp()
                    setComp(() => importComponent)
                } catch (e) {
                    throw new Error('加载组件出错')
                } 
            }
            fetchComponent()
        }, [])
        return (
            Comp ? <Comp {...props} /> : <div>加载中...</div>
        )
    }
    return AsyncComponent
}

export default asyncImportComponent