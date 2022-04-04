export interface IBaseControlItem<TValue> {
    key: string,
    isValid: boolean,
    label: string,
    errorLabel: string,
    value: TValue,
    fromModel: (old: BaseControlItem<TValue>) => void
}


export class BaseControlItem<TValue> implements IBaseControlItem<TValue> {
    public key: string = "";
    public isValid: boolean = true;
    public label: string = "";
    public errorLabel: string = "";
    public value: TValue;

    constructor(newValue: TValue) {
        this.value = newValue;
    }

    public fromModel(old: BaseControlItem<TValue>){
        this.key = old.key;
        this.isValid = true;
        this.label = old.label;
        this.errorLabel = "";
    }
}