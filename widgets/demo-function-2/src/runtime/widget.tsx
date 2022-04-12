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
import { AllWidgetProps, React, IMState, FormattedMessage } from 'jimu-core';
// import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from 'jimu-ui';
import { IMConfig } from '../config';
// import defaultMessage from './translations/default';

interface ExtraProps {
  locale: string;
}

export default function Widget(props: AllWidgetProps<IMConfig> & ExtraProps) {
  return <div className="widget-demo-function jimu-widget" style={{ overflow: 'auto' }}>
    {myState.a}
  </div>;
}

/* export default function Widget(props: AllWidgetProps<IMConfig> & ExtraProps) {
  return <div className="widget-demo-function jimu-widget" style={{ overflow: 'auto' }}>
    <Dropdown>
    <DropdownButton>
      dropdown test
    </DropdownButton>
    <DropdownMenu>
      <DropdownItem>choice 1</DropdownItem>
      <DropdownItem>choice 2</DropdownItem>
      <DropdownItem>choice 3</DropdownItem>
      <DropdownItem>choice 4</DropdownItem>
    </DropdownMenu>
    </Dropdown>
  </div>;
} */

Widget.mapExtraStateProps = (state: IMState, ownProps: AllWidgetProps<IMConfig>): ExtraProps => {
  return {
    locale: state.appContext.locale
  }
}
