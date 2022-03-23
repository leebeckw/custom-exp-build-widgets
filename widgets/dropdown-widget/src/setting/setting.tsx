import { React } from "jimu-core";
import { AllWidgetSettingProps } from "jimu-for-builder";
import {
  SettingRow,
  SettingSection,
} from "jimu-ui/advanced/setting-components";
import { Button } from "jimu-ui";
import { IMConfig } from "../config";


interface IState {
  /**
   * Settings interface panel
   * The panel will include a section for inputting instruction text, and URL for the map
   */
  
  dropdownTextareaValue: string;
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
        dropdownTextareaValue:
          this.props.config?.dropdownOptions === undefined
            ? ""
            : this.props.config?.dropdownOptions.join("\n")
      };
    }

  onDropdownTextChange = (event) => {
    /**
     * In the text input area, author should input instructions
     * separate by a new line.
     * Each new line will create an element in the widget
     * once it re-renders.
     */

    this.setState({ dropdownTextareaValue: event.target.value });

    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set(
        "dropdownOptions",
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
        "updateDropdown",
        true
      ),
    });
  };


  render() {
    return (
      
      <div className="input-dropdown-options-in-text">

        <SettingSection
          title={this.props.intl.formatMessage({
            id: "dropdownOptions",
            defaultMessage: "Dropdown Options",
          })}
        >

          {/* Render text input area for instructions */}
          <SettingRow>
            <textarea
              className="w-100 p-1"
              style={{ whiteSpace: "pre", minHeight: "100px" }}
              value={this.state.dropdownTextareaValue}
              onChange={this.onDropdownTextChange}
            ></textarea>
          </SettingRow>

          {/* Render button to update instructions */}
          <SettingRow>
            <Button onClick={this.onButtonClick}>
              Update Dropdown Options
            </Button>
          </SettingRow>
        </SettingSection>
      </div>
    );
  }
}