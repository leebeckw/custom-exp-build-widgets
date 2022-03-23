import { ImmutableObject } from "seamless-immutable";

export interface Config {
    dropdownOptions: Array<string>;
    updateDropdown: Boolean;
}

export type IMConfig = ImmutableObject<Config>;