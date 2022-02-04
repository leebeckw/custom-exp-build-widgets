// import * as React from 'react';
import {List, arrayMove, StatefulList} from 'baseui/dnd-list';
import { React, AllWidgetProps, jsx } from "jimu-core";
import {JimuMapViewComponent, JimuMapView } from "jimu-arcgis";
import Point from "esri/geometry/Point";
import { Button, Icon } from 'jimu-ui';
import FeatureLayer from "esri/layers/FeatureLayer";


// Default type for state and props is {}
export default class Example extends React.Component<{}, {items: Array<React.ReactNode>}>
  {
    state = {
      items: [
        '1',
        '2',
        '3'
      ],
      jimuMapView: null,
      latitude: "",
      longitude: "",
      showMessage: false
    };

    
    render() {
      return (
        <List
          items={this.state.items}
          onChange={({oldIndex, newIndex}) =>
            this.setState(prevState => ({
              items: arrayMove(prevState.items, oldIndex, newIndex),
            }))
          }
        />

      );
    }
  }