import { ImmutableObject } from "seamless-immutable";

export interface Config {
    instructText: Array<string>;
    layerUrls: Array<string>;
    isChecked: Boolean;
}

export type IMConfig = ImmutableObject<Config>;