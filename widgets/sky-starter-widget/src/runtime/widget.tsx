/** @jsx jsx */
import { React, AllWidgetProps, jsx } from "jimu-core";

export default class Widget extends React.PureComponent<AllWidgetProps<any>, any> {
  render() {
    return(
      <div className="widget-starter jimu-widget">
        <h1>Skylar's Super Awesome Widget!</h1>
      </div>
    )
  }
}

