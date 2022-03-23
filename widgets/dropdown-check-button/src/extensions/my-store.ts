import { extensionSpec, ImmutableObject, IMState } from 'jimu-core';

export enum MyActionKeys {
  MyAction1 = 'MY_ACTION_1'
}

export interface Action1 {
  type: MyActionKeys.MyAction1;
  val: string;
}

type ActionTypes = Action1

interface DropdownObject {
  val: number;
  id: string;
}

interface MyState {
  a: Array<DropdownObject>;
}

type IMMyState = ImmutableObject<MyState>;

declare module 'jimu-core/lib/types/state'{
  interface State{
    myState?: IMMyState
  }
}

export default class MyReduxStoreExtension implements extensionSpec.ReduxStoreExtension {
  id = 'my-local-redux-store-extension';

  getActions() {
    return Object.keys(MyActionKeys).map(k => MyActionKeys[k]);
  }

  getInitLocalState() {
    const initialArray : Array<DropdownObject> = [];
    return {
      a: initialArray
    }
  }

  getReducer() {
    return (localState: IMMyState, action: ActionTypes, appState: IMState): IMMyState => {
      switch (action.type) {
        case MyActionKeys.MyAction1:
          return localState.set('a', action.val);
        default:
          return localState;
      }
    }
  }

  getStoreKey() {
    return 'myState';
  }
}