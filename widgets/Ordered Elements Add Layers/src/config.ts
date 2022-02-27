import { ImmutableObject } from "seamless-immutable";

export interface Config {
    instructText: Array<string>;
    layerUrls: Array<string>;
    textChange: Boolean;
}

export type IMConfig = ImmutableObject<Config>;