import { React } from "jimu-core";
import { AllWidgetSettingProps } from "jimu-for-builder";
import {
  MapWidgetSelector,
  SettingRow,
  SettingSection,
} from "jimu-ui/advanced/setting-components";
import { IMConfig } from "../config";


interface IState {
  /**
   * Settings interface panel
   * The panel will include a section for inputting instruction text, and URL for the map
   */
  layerTextareaValue: string;
}

export default class Setting extends React.PureComponent<
  AllWidgetSettingProps<IMConfig>,
  IState> {
    constructor(props) {
      super(props);
      this.state = {
        /**
         * Initialize the settings panel interface
         */
        layerTextareaValue:
          this.props.config?.layerUrls === undefined
            ? ""
            : this.props.config?.layerUrls.join("\n")
      };
    }

  onMapSelected = (useMapWidgetIds: string[]) => {
    /**
     * Once a map is in the experience builder, a dropdown
     * will show the maps to connect the widget to
     */
    this.props.onSettingChange({
      id: this.props.id,
      useMapWidgetIds: useMapWidgetIds,
    });
  };

  onLayerTextChange = (event) => {
    /**
     * In the layer URL input area, author should input URLS for layers
     * Layer URLS should be separated by a new line
     */

    this.setState({ layerTextareaValue: event.target.value });
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set(
        "layerUrls",
        event.target.value.split("\n")
      ),
    });
  };


  render() {
    return (
      
      <div className="input-instructions-in-text">
        <SettingSection
          title={this.props.intl.formatMessage({
            id: "selectedMapLabel",
            defaultMessage: "Map",
          })}
        >

          {/* Render dropdown menu to connect widget to a map */}
          <SettingRow>
            <MapWidgetSelector
              onSelect={this.onMapSelected}
              useMapWidgetIds={this.props.useMapWidgetIds}
            />
          </SettingRow>
        </SettingSection>

        <SettingSection
          title={this.props.intl.formatMessage({
            id: "toAdd",
            defaultMessage: "URL(s) of Layer(s) to Add",
          })}
        >

          {/* Render text input area to add URL to map layer */}
          <SettingRow>
            <textarea
              className="w-100 p-1"
              style={{ whiteSpace: "pre", minHeight: "100px" }}
              value={this.state.layerTextareaValue}
              onChange={this.onLayerTextChange}
            ></textarea>
          </SettingRow>
        </SettingSection>
      </div>
    );
  }
}