import Site from "./site";
import Monitor from "./monitor";
import Serializable from "./serializableDecorator";

@Serializable()
export default class Settings {

    public sites: Site[] = [];

    public monitors: Monitor[] = [];

}