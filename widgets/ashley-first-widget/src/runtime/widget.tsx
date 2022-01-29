 /** @jsx jsx */
 import { React, AllWidgetProps, jsx } from "jimu-core";
 import {JimuMapViewComponent, JimuMapView } from "jimu-arcgis";
 import Point from "esri/geometry/Point";
 import { Button, Icon } from 'jimu-ui';
 import FeatureLayer from "esri/layers/FeatureLayer";

 export default class Widget extends React.PureComponent<AllWidgetProps<any>, any> {
  state = {
    jimuMapView: null,
    latitude: "",
    longitude: "",
    showMessage: false
  };

  onButtonClickHandler = () => {
    this.setState({showMessage: true});
   };


  formSubmit = (evt) => {
    evt.preventDefault();

    // adding a new feature layer
    const layer = new FeatureLayer ({

      // Taken from the URL section of the Layer page
      url: "https://services3.arcgis.com/GzteEaZqBuJ6GIYr/arcgis/rest/services/a82fa9/FeatureServer"

    });

    // Adding layer to the map
    this.state.jimuMapView.view.map.add(layer);

    // Message window
    window.alert("Layer added!")
  }

  activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      this.setState ({
        jimuMapView: jmv
      });

      jmv.view.on("pointer-move", (evt) => {
        const point: Point = this.state.jimuMapView.view.toMap ({
          x: evt.x,
          y: evt.y
        });
        this.setState({
          latitude: point.latitude.toFixed(3),
          longitude: point.longitude.toFixed(3)
        });
      });
    }
  };

  render() {
    /** Implement Settings Panel (right-hand sidebar on Experience Builder) */
    return (
      <div className="widget-starter jimu-widget">
        {this.props.hasOwnProperty("useMapWidgetIds")
          && this.props.useMapWidgetIds && this.props.useMapWidgetIds[0]
          && (
              <JimuMapViewComponent useMapWidgetId={this.props.useMapWidgetIds?.[0]}
                                    onActiveViewChange={this.activeViewChangeHandler} />
        )}
        <p style={{ color: '#000000' }}>
          Move your mouse to see the latitude and longitude!
        </p>
        <p>
          Lat/Lon: {this.state.latitude} {this.state.longitude}
        </p>
        <p>
          You can also add layers to the map!
        </p>
        <center>
        <form onSubmit={this.formSubmit}>
          <div>
            <Button type="primary" style={{background: 'orange', color: "#ffffff"}} onClick={this.onButtonClickHandler}>Add Layer</Button>
            {this.state.showMessage && <p>Congrats, you added a layer!</p>}
          </div>
        </form>
        </center>
      </div>
    );
  }

}