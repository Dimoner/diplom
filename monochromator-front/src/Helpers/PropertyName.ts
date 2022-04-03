function getPropertyNameInternal<T>(expression: (instance: T) => any, options: {
    isDeep: boolean
}): keyof T {
    let propertyThatWasAccessed = "";
    const proxy: any = new Proxy({} as any, {
        get: function(_: any, prop: any) {
            if(options.isDeep) {
                if(propertyThatWasAccessed)
                    propertyThatWasAccessed += ".";

                propertyThatWasAccessed += prop;
            } else {
                propertyThatWasAccessed = prop;
            }
            return proxy;
        }
    });
    expression(proxy);

    return propertyThatWasAccessed as  keyof T;
}

export function getPropertyName<T extends {[key in string]: any}>(expression: (instance: T) => any):  keyof T {
    return getPropertyNameInternal<T>(expression, {
        isDeep: false
    });
}


