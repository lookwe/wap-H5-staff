/*
 * @Author: huangzhongfei
 * @Date: 2021-11-03 18:01:58
 * @LastEditTime: 2021-03-25 09:59:28
 */
class LocalStorage {
    /**
     * 设置localStorage 内容
     * @author huangzhongfei
     * @date 2021-11-3
     * @param {String} {key} 主键
     * @param {any} {value} 内容
     * @returns {any}
     */
    static set(key, value) {
        if (typeof key !== 'string') {
            throw 'localstorage -- key必须为字符串'
        }
        value = value || ''
        value = typeof value === 'object' ? JSON.stringify(value) : value
        window.localStorage.setItem(key, value);
    }

    /**
     * 根据Key 查询缓存
     * @author huangzhongfei
     * @date 2021-11-3
     * @param {String} {key} 主键
     * @returns {any}
     */
    static get(key) {
        let value = window.localStorage.getItem(key);
        try {
            return JSON.parse(value)
        } catch (err) {
            return value
        }
    }

    /**
     * 根据Key 清除缓存, 可传多个key值
     * @author huangzhongfei
     * @date 2021-11-3
     * @param {any} {key} 主键
     * @returns {Object}
     */
    static remove() {
        const keys = Array.from(arguments);
        for (let i in keys) {
            window.localStorage.removeItem(keys[i]);
        }
    }

    /**
     * 清除所有缓存
     * @author huangzhongfei
     * @date 2021-11-3
     * @returns {undefined}
     */
    static removeAll() {
        window.localStorage.clear();
    }

}

export default LocalStorage