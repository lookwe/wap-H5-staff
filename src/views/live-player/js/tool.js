// 计算人数
export function tranNumber(num, point) {
    let numStr = num.toString()
    // 十万以内直接返回
    if (numStr.length < 5) {
        return numStr;
    }

    //大于6位数是十万 (以10W分割 10W以下全部显示)
    else if (numStr.length > 5) {
        let decimal = numStr.substring(numStr.length - 4, numStr.length - 4 + point)
        return parseFloat(parseInt(num / 10000) + '.' + decimal) + 'W';
    }

    //大于6位数是十万 (以10W分割 10W以下全部显示)
    else if (numStr.length > 4) {
        let decimal = numStr.substring(numStr.length - 3, numStr.length - 3 + point)
        return parseFloat(parseInt(num / 1000) + '.' + decimal) + 'K';
    }
}