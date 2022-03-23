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
import { React, AllWidgetProps, jsx, IMState} from 'jimu-core';
import { IMConfig } from "../config";
import {Button} from 'jimu-ui';
import FeatureLayer from "esri/layers/FeatureLayer";
import { JimuMapViewComponent, JimuMapView } from "jimu-arcgis";
import DropdownObject from '../extensions/my-store'

interface IState {
  jimuMapView: JimuMapView;
  correct: Boolean;
  tries: number;
}

export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig>, IState & {a: Array<DropdownObject>}, {}> {
  constructor(props) {
    super(props);
    this.state = {
      jimuMapView: null,
      correct: false,
      tries: 0
    };
  }
  /**
   * Map the state your widget needs
   * @param state
   */
  static mapExtraStateProps(state: IMState){
    return {a: state.myState.a};
  }

  // will say "right answer" even if not all have been touched
  checkAnswers = (evt) => {
    this.setState({tries: this.state.tries + 1});
    const totalAnswers = this.props.a.length;
    var count = 0;
    this.props.a.forEach(function(ddObj) {
      if (ddObj["val"] === "0") {
        count++;
        console.log("count", count);
      }
    });
    if (totalAnswers > 0 && count === totalAnswers) {
      this.setState({correct: true});
      let urlList = this.props.config.layerUrls;
      for (var i = 0; i< urlList.length; i++) {
        // create a new FeatureLayer
        const layer = new FeatureLayer({
          url: this.props.config.layerUrls[i] // adds all layers at once
        });
        // Add the layer to the map (accessed through the Experience Builder JimuMapView data source)
        this.state.jimuMapView.view.map.add(layer);
      }
    }
    else {
      this.setState({correct: false});
      window.alert("Try again!");
    }
  }

  activeViewChangeHandler = (jmv: JimuMapView) => {
    /*
     * Instrumental to updating the map when the drag and drop
     * widget is connected to the map 
     */
    if (jmv) {
      this.setState({
        jimuMapView: jmv
      });
    }
  };

  render() {
    return (
      <div className="widget-use-redux jimu-widget m-2">
        {this.props.hasOwnProperty("useMapWidgetIds") && this.props.useMapWidgetIds && this.props.useMapWidgetIds[0] && (
          <JimuMapViewComponent useMapWidgetId={this.props.useMapWidgetIds?.[0]} onActiveViewChange={this.activeViewChangeHandler} />
        )}
        <Button onClick={this.checkAnswers} type="primary" style={{background: 'orange', color: "#ffffff"}}>Check Answers!</Button>
        {this.state.correct && <p>Congrats! You got the right answer!</p>}
        {<p>Number of Tries: {this.state.tries}</p>}
      </div>

    );
  }
}
