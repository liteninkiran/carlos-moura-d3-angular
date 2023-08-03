export class ObjectHelper {
    static UpdateObjectWithPartialValues = <T>(base: T, update: Partial<T>): T => {
        const initial: T = Object.assign({}, base);
        const updates: Partial<T> = Object.assign({}, update);
        const final: T = {} as T;

        Object.keys(initial).forEach((key) => {
            if (updates.hasOwnProperty(key)) {
                if (updates[key] instanceof Object && !Array.isArray(updates[key])) {
                    final[key] = ObjectHelper.UpdateObjectWithPartialValues(initial[key], updates[key]);
                } else {
                    final[key] = updates[key];
                }
            } else {
                final[key] = initial[key];
            }
        });

        return final;
    }
}

export default ObjectHelper;
