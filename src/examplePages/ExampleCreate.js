/*
 * @Author: your name
 * @Date: 2020-05-11 22:00:59
 * @LastEditTime: 2020-05-12 21:02:37
 * @LastEditors: Please set LastEditors
 * @Description: 动画效果的示例视图生成器
 * @FilePath: /va_module/src/examplePages/ExapmleCreat.js
 */
import React, {useState, useEffect} from 'react'

function NewComp(Comp, props) {
    const {mockData, updateData, title} = props
    const [data, setData] = useState(mockData)
    const [showAnimation, setShowAnimation] = useState(false)
    const getDomain = (data, key) => {
        let vals = data.map(d => (d[key])).sort((a, b) => a - b)
        return [vals[0], vals[vals.length - 1]]
    }

    // 开启/关闭动画
    useEffect(() => {
        let timer 
        if(showAnimation) {
            timer = setInterval(() => {
                let newData = updateData()
                setData(newData)
            }, 1000)
        }
        return () => timer && clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showAnimation])

    return (<div className = 'app'>
        <h4>{title}</h4>  
        <button onClick = {() => {setShowAnimation(!showAnimation)}}>播放/停止</button>
        <Comp
            {...props}
            data = {data}
            getDomain = {getDomain} 
        ></Comp>
    </div>)
}

function ExampleCreate(Comp) {
    return props => NewComp(Comp, props)
}

export default ExampleCreate