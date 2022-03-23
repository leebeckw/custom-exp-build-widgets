import intl from 'esri/intl';
import { extensionSpec, ImmutableObject, IMState } from 'jimu-core';

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
        case MyActionKeys.MyAction1:
          // this needs to be an iterable
          const index = localState.a.findIndex(dropdown => dropdown.id === action.widgetID);
          console.log(index);
          // PUSH CASE --> different updater
          if (index === -1) {
            //return localState;
            // need a collection, iterable, updater function (see https://immutable-js.com/docs/v4.0.0/updateIn()/)
            const toAdd : DropdownObject = {"id": action.widgetID, "val": action.dropdownValue};
            console.log("PUSHING", action.widgetID, action.dropdownValue)
            console.log("OLD ARRAY", localState.a)
            return localState.updateIn(['a'], arr => arr.concat(toAdd));
            /*  return {localState.a: [...localState.a, {"id": action.widgetID, "val": action.val}]}
                return { list: [...state.list, action.payload.item]};
                return [...localState.a, {"id": action.widgetID, "val": action.val}];
                need to localState.set --> requires a function to overload (set) but would it be set??
                because localState is immutable
                might need something similar for obj.val */
          }
          // MODIFY CASE --> different updater
          else {
            // let obj = localState.a[index];
            // obj.val = action.val;
            // const toUpdate : DropdownObject = {"id": action.widgetID, "val": action.val};
            console.log("UPDATING", action.widgetID, action.dropdownValue)
            console.log("OLD ARRAY", localState.a)
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