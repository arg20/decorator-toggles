import 'reflect-metadata';

interface ToggleOptions {
    returns?: any,
    message?: string
}

class ToggleCenter {
    toggles: Map<string, boolean> = new Map<string, boolean>();

    stream = process.stdout;

    constructor(toggles?) {
        if (toggles) {
            this.set(toggles);
        }
    }

    set(toggles) {
        Object.getOwnPropertyNames(toggles).forEach(toggleName => {
            let toggleValue = toggles[toggleName];
            this.setToggle(toggleName, toggleValue);
        });
    }

    on(toggleName: string) {
        this.setToggle(toggleName, true);
    }

    setToggle(toggleName: string, toggleValue: boolean | string) {
        this.toggles.set(toggleName, toggleValue === true || toggleValue === 'true');
    }

    off(toggleName: string) {
        this.setToggle(toggleName, false);
    }

    isToggleOn(toggleName: string) {
        return this.toggles.get(toggleName);
    }

    getDecorator() {
        let toggleCenter = this;

        return function ToggleDecoratorFactory(toggleName: string, options : ToggleOptions = {}) {
            return function ToggleDecorator(target, key?: string, value?: any) {
                return {
                    value: function (...args: any[]) {
                        if (toggleCenter.isToggleOn(toggleName)) {
                            let result = value.value.apply(this, args);
                            return result;
                        }
                        let stream = toggleCenter.stream;
                        let targetName = '[' + target.constructor.name + ']'  || '';
                        stream.write(options.message || `${targetName} Method: ${key} not executed. Toggle "${toggleName}" is OFF.`);

                        let returnType : Function = Reflect.getMetadata("design:returntype", target, key);

                        if (returnType) {
                            if (returnType.name === 'Promise') {
                                return Promise.resolve(options.returns || null);
                            }
                        }

                        if (options.returns) {
                            return options.returns;
                        }
                    }
                };
            }
        }

    }

}

export {ToggleOptions, ToggleCenter};