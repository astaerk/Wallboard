import Serialijse from "serialijse";
import Monitor from "./monitor";
import Site from "./site";
import Settings from "./settings";

export default class SerializerConfigManager {

    private constructor() {
        throw new Error("you should not instantiate this class");
    }

    public static registerSerializableTypes(): void {
        Serialijse.declarePersistable(Monitor);
        Serialijse.declarePersistable(Site);
        Serialijse.declarePersistable(Settings);
    }
}
