/** @jsx jsx */
import { React, AllWidgetProps, jsx } from "jimu-core";
import { JimuMapViewComponent, JimuMapView } from "jimu-arcgis";
import FeatureLayer from "esri/layers/FeatureLayer";

export default class Widget extends React.PureComponent<AllWidgetProps<any>, any> {
  state = {
    jimuMapView: null
  };

  activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      this.setState({
        jimuMapView: jmv
      });
    }
  };

  formSubmit = (evt) => {
    evt.preventDefault();

    // create a new FeatureLayer
    const layer = new FeatureLayer({
      url: "https://services3.arcgis.com/GzteEaZqBuJ6GIYr/arcgis/rest/services/worldcities/FeatureServer"
    });

    // Add the layer to the map (accessed through the Experience Builder JimuMapView data source)
    this.state.jimuMapView.view.map.add(layer);
  };

  render() {
    return (
      <div className="widget-starter jimu-widget">
        {this.props.hasOwnProperty("useMapWidgetIds") && this.props.useMapWidgetIds && this.props.useMapWidgetIds[0] && (
          <JimuMapViewComponent useMapWidgetId={this.props.useMapWidgetIds?.[0]} onActiveViewChange={this.activeViewChangeHandler} />
        )}

        <form onSubmit={this.formSubmit}>
          <div>
            <button>Add Layer</button>
          </div>
        </form>
      </div>
    );
  }
}

