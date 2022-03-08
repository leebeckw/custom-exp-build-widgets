import { ImmutableObject } from "seamless-immutable";

export interface Config {
    instructText: Array<string>;
    layerUrls: Array<string>;
    isClicked: Boolean;
    codeText: string;
}

export type IMConfig = ImmutableObject<Config>;