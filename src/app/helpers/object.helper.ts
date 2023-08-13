export class ObjectHelper {
    static UpdateObjectWithPartialValues = <T>(base: T, update: Partial<T>): T => {
        const baseObj: T = Object.assign({}, base);
        const updateObj = Object.assign({}, update);

        // only needed if base is not fully assigned (update contains more properties than base)
        let updatedObj: T = Object.assign({}, base, update);

        for (const key in baseObj) {
            const baseElem = baseObj[key];
            let updatedElem, updateElem;

            if (updateObj.hasOwnProperty(key)) {
                if ((baseElem instanceof Object) && !Array.isArray(baseElem)) {
                    updateElem = updateObj[key] as T[keyof T];
                    updatedElem = ObjectHelper.UpdateObjectWithPartialValues<typeof baseElem>(baseElem, updateElem as any);
                } else {
                    updatedElem = updateObj[key];
                }
            } else {
                updatedElem = baseElem;
            }

            updatedObj = { ...updatedObj, [key]: updatedElem };
        }

        return updatedObj;
    }
}

export default ObjectHelper;
