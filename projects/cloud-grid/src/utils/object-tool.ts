export class ObjectTool {

    public static deepCopy<T = any>(obj: T): T {
        if (!obj) { return obj; }

        let str: string = JSON.stringify(obj);
        return JSON.parse(str);
    }

}
