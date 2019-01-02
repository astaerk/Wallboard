import Site from "./site";
import Serializable from "./serializableDecorator";

@Serializable()
export default class Settings {

    public sites: Site[] = [];

}