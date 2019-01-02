import Serialijse from "serialijse";

export type SerializableConstructor<T> = { new(...params: any[]): T };

export default function Serializable(typeAlias?: string): (<T>(target: SerializableConstructor<T>) => void) {
    return <T>(target: SerializableConstructor<T>): void => {
        Serialijse.declarePersistable(target, typeAlias);
    };
}
