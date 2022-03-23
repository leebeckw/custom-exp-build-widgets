/** @jsx jsx */
/**
  Licensing

  Copyright 2022 Esri

  Licensed under the Apache License, Version 2.0 (the "License"); You
  may not use this file except in compliance with the License. You may
  obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
  implied. See the License for the specific language governing
  permissions and limitations under the License.

  A copy of the license is available in the repository's
  LICENSE file.
*/
import { React, AllWidgetProps, jsx, IMState } from 'jimu-core';
import { IMConfig } from "../config";
import DropdownObject from '../extensions/my-store'

const shuffleItems = (items) => {
  /*
   * Shuffles all items provided and returns them in shuffled order.
   * The shuffled array must be at least 50% different from original array
   *
   * Inputs
   *    items <[dict]> each item is a dictionary with id and content keys
   * Returns
   *    returns shuffled items array - the id and content of each item is unchanged
   */
  let shuffled_items = items;
  if (items.length > 1) {
    shuffled_items.sort(() => Math.random() - 0.5);
  };
  return shuffled_items

}

export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig> & {a: Array<DropdownObject>}, {}> {
  constructor(props) {
    super(props);
    this.state = {
      items: this.initializeItems(),
      updateDropdown: false,
      // tries: 0
    };
  }

  /**
   * Map the state your widget needs
   * @param state
   */
  static mapExtraStateProps(state: IMState){
    return {a: state.myState.a};
  }

  initializeItems(){
    /*
     * Creates items based in the text in the configuration variable
     * called instructText (this.props.config.instructText)
     */
    this.props.config.updateDropdown = false;  // resets button in settings panel
    let count = 0;
    let dropdownOptions = this.props.config.dropdownOptions;  // text to make into items
  
    if (dropdownOptions != undefined){
      count = dropdownOptions.length;  // if instructText is not an empty string
    }

    let arr = Array.from({ length: count }, (v, k) => k).map((k) => ({
      value: `${k}`,  // Id is the order the item SHOULD be in - initial order
      content: `${dropdownOptions[k]}`  // split by new line - controlled in settings
    }))

    return shuffleItems(arr);
  }

  getItems() {
    /*
     * Gets items within widget when widget is re-rendered. If the
     * 'update instruction' button in the settings panel has been
     * clicked, reinitialize items. Else, return current items.
     */
    if (this.props.config.updateDropdown) {  // updated instructions
      let shuffledArr = this.initializeItems();
      this.setState({items: shuffledArr})  // update items
      return shuffledArr;
    }
    else {
      return this.state.items;  // return current items
    }
  };

  onChange = (evt) => {
    const valueConst = evt.target.value;
    this.props.dispatch({
      type: 'MY_ACTION_1',
      widgetID: this.props.id,
      dropdownValue: valueConst,
    });
    // console.log("VALUE:", evt.target.value);
  }

  render() {
    return (
      <div className="widget-use-redux jimu-widget m-2">
        <select onChange={this.onChange}>
          <option value="1"></option>
          {this.getItems().map((i) => {
            return <option value={i.value}>{i.content}</option>;
          })}
        </select>
      </div>
    );
  }
}
