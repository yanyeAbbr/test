

// 引入一些需要用到的库以及一些声明
import * as puppeteer from 'puppeteer' // 引入Puppeteer
import mongo from '../lib/mongoDb' // 需要用到的 mongodb库，用来存取爬取的数据
import chalk from 'chalk' // 一个美化 console 输出的库

const log = console.log // 缩写 console.log
const TOTAL_PAGE = 50 // 定义需要爬取的网页数量，对应页面下部的跳转链接

// 定义要爬去的数据结构
interface IWriteData {
    link: string // 爬取到的商品详情链接
    picture: string // 爬取到的图片链接
    price: number // 价格，number类型，需要从爬取下来的数据进行转型
    title: string // 爬取到的商品标题
}

// 格式化的进度输出 用来显示当前爬取的进度
function formatProgress (current: number): string {
    let percent = (current / TOTAL_PAGE) * 100
    let done = ~~(current / TOTAL_PAGE * 40)
    let left = 40 - done
    let str = `当前进度：[${''.padStart(done, '=')}${''.padStart(left, '-')}]  ${percent}%`
    return str
}



// 因为我们需要用到大量的 await 语句，因此在外层包裹一个 async function
async function main() {
    // Do something
}
main()

// 进入代码的主逻辑
async function main() {

}
