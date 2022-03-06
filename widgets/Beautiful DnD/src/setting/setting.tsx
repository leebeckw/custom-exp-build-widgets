import { MapWidgetSelector } from "jimu-ui/advanced/setting-components";
import { React, jsx } from "jimu-core";
import { AllWidgetSettingProps } from "jimu-for-builder";


export default class Setting extends React.PureComponent<AllWidgetSettingProps<any>, any> {
    onMapWidgetSelected = (useMapWidgetIds: string[]) => {
      this.props.onSettingChange({
        id: this.props.id,
        useMapWidgetIds: useMapWidgetIds
      });
    };

    render() {
      return <div className="widget-setting-demo">
     <MapWidgetSelector
       useMapWidgetIds={this.props.useMapWidgetIds}
       onSelect={this.onMapWidgetSelected}
        />
      </div>;
    }
  }