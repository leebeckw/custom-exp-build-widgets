import { React } from "jimu-core";
import { AllWidgetSettingProps } from "jimu-for-builder";
import {
  MapWidgetSelector,
  SettingRow,
  SettingSection,
} from "jimu-ui/advanced/setting-components";
import { Button } from "jimu-ui";
import defaultI18nMessages from "./translations/default";
import { IMConfig } from "../config";


interface IState {
  /**
   * Settings interface panel
   * The panel will include a section for inputting instruction text, and URL for the map
   */
  
  instructTextareaValue: string;
  layerTextareaValue: string;
}

export default class Setting extends React.PureComponent<
  AllWidgetSettingProps<IMConfig>,
  IState> {
    constructor(props) {
      super(props);

      console.log(
        "TYPEOF undefined",
        typeof this.props.config?.instructText === undefined,
        typeof this.props.config?.layerUrls === undefined,
        typeof this.props.config?.isClicked === undefined,
      );

      this.state = {
        /**
         * Initialize the settings panel ionterface
         */
        instructTextareaValue:
          this.props.config?.instructText === undefined
            ? ""
            : this.props.config?.instructText.join("\n"),
        layerTextareaValue:
          this.props.config?.layerUrls === undefined
            ? ""
            : this.props.config?.layerUrls.join("\n"),
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

  onInstructTextChange = (event) => {
    /**
     * In the text input area, author should input instructions
     * separate by a new line.
     * Each new line will create an element in the widget
     * once it re-renders.
     */

    this.setState({ instructTextareaValue: event.target.value });

    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set(
        "instructText",
        event.target.value.split("\n"),
      ),
    });
  };

  onButtonClick = (event) => {
    /**
     * Set the isClicked variable in the config file to true
     * This will initiate an update in the widget
     * The text from the text input area will appear in the widget
     */

    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set(
        "isClicked",
        true
      ),
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
            defaultMessage: defaultI18nMessages.selectedMap,
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
            id: "instructions",
            defaultMessage: defaultI18nMessages.instructions,
          })}
        >

          {/* Render text input area for isntructions */}
          <SettingRow>
            <textarea
              className="w-100 p-1"
              style={{ whiteSpace: "nowrap", minHeight: "100px" }}
              value={this.state.instructTextareaValue}
              onChange={this.onInstructTextChange}
            ></textarea>
          </SettingRow>

          {/* Render button to update instructions */}
          <SettingRow>
            <Button
              onClick={this.onButtonClick}
            >
              Update Instructions
            </Button>
          </SettingRow>
        </SettingSection>

        <SettingSection
          title={this.props.intl.formatMessage({
            id: "toAdd",
            defaultMessage: defaultI18nMessages.toAdd,
          })}
        >

          {/* Render text input area to add URL to map layer */}
          <SettingRow>
            <textarea
              className="w-100 p-1"
              style={{ whiteSpace: "nowrap", minHeight: "100px" }}
              value={this.state.layerTextareaValue}
              onChange={this.onLayerTextChange}
            ></textarea>
          </SettingRow>
        </SettingSection>
      </div>
    );
  }
}