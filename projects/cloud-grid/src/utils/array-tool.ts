export class ArrayTool {

    /**
     * 从数组中移除给定函数返回 false 的元素
     * 返回值是被移除的元素
     * @param arr 数组
     * @param func 移除判断函数
     */
    public static remove<T>(arr: Array<T>, func: (value: T, index?: number, array?: Array<T>) => boolean): T {
        if (arr && Array.isArray(arr)) {
            const removeArr: Array<T> = arr.filter(func).reduce((acc, val) => {
                arr.splice(arr.indexOf(val), 1);
                return acc.concat(val);
            }, []);
            if (removeArr && removeArr.length > 0) {
                return removeArr[0];
            }
        }
        return null;
    }

    public static deepCopy<T = any>(arr: Array<T>): Array<T> {
        if (!arr || arr.length < 1) { return []; }

        let str: string = JSON.stringify(arr);
        return JSON.parse(str);
    }

}
