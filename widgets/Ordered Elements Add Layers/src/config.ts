import { ImmutableObject } from "seamless-immutable";

export interface Config {
    instructText: Array<string>;
    layerUrls: Array<string>;
    isClicked: Boolean;
}

export type IMConfig = ImmutableObject<Config>;