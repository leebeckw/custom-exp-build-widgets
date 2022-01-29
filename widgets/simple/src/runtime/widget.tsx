<<<<<<< HEAD
/** @jsx jsx */
import { React, AllWidgetProps, jsx } from 'jimu-core'
import { IMConfig } from '../config'

export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig>, any> {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    return (
      <div className="widget-demo jimu-widget m-2">
        <p>Simple Widget</p>
        <p>exampleConfigProperty: {this.props.config.exampleConfigProperty}</p>
      </div>
    )
  }
}
=======
/** @jsx jsx */
import { React, AllWidgetProps, jsx } from 'jimu-core'
import { IMConfig } from '../config'

export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig>, any> {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    return (
      <div className="widget-demo jimu-widget m-2">
        <p>Simple Widget</p>
        <p>exampleConfigProperty: {this.props.config.exampleConfigProperty}</p>
      </div>
    )
  }
}
>>>>>>> 8b0cfe1e6d10a3d094da7a454cc49b698496d7a6
