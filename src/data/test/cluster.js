/*
 * @Author: your name
 * @Date: 2020-05-17 14:52:01
 * @LastEditt: 2020-05-17 14:52:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /test/src/data/test/cluster.js
 */ 
import originData from './cluster.json'
// console.log(clusterJson)
// let originData = JSON.parse(clusterJson)

let cluster = originData.data.map(d => ({
    freq: d.f,
    snr: d.s,
    dbm: d.d,
    category: d.c,
    band: d.b,
    isNewSignal: d.i,
    time: d.t
}))

export default cluster
