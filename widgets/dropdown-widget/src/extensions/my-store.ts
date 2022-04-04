import intl from 'esri/intl';
import { extensionSpec, ImmutableObject, IMState } from 'jimu-core';
/* Setting up Redux extension that is also accessed by the dropdown-check-button */

export enum MyActionKeys {
  MyAction1 = 'MY_ACTION_1'
}

export interface Action1 {
  type: MyActionKeys.MyAction1;
  widgetID: string;
  dropdownValue: number;
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
        // when a dropdown answer is selected this case runs
        case MyActionKeys.MyAction1:
          // gets the index in the array of the specific dropdown that is being changed
          const index = localState.a.findIndex(dropdown => dropdown.id === action.widgetID);
          console.log(index);
          // PUSH CASE --> if this is the first time the dropdown is changed, push a DropdownObject onto the array
          if (index === -1) {
            const toAdd : DropdownObject = {"id": action.widgetID, "val": action.dropdownValue};
            return localState.updateIn(['a'], arr => arr.concat(toAdd));
          }
          // MODIFY CASE --> if this is not the first time the dropdown is changed, modify the DropdownObject
          else {
            return localState.setIn(['a', index, "val"], action.dropdownValue);
          }
          // return localState;
        default:
          return localState;
      }
      console.log(localState.a);
    }
  }

  getStoreKey() {
    return 'myState';
  }
}