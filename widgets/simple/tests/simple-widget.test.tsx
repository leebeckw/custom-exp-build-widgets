<<<<<<< HEAD
import { React } from 'jimu-core'
import _Widget from '../src/runtime/widget'
import { widgetRender, wrapWidget } from 'jimu-for-test'

const render = widgetRender()
describe('test simple widget', () => {
  it('simple test', () => {
    const Widget = wrapWidget(_Widget, {
      config: { exampleConfigProperty: 'a' }
    })
    const { queryByText } = render(<Widget widgetId="Widget_1" />)
    expect(queryByText('exampleConfigProperty: a').tagName).toBe('P')
  })
})
=======
import { React } from 'jimu-core'
import _Widget from '../src/runtime/widget'
import { widgetRender, wrapWidget } from 'jimu-for-test'

const render = widgetRender()
describe('test simple widget', () => {
  it('simple test', () => {
    const Widget = wrapWidget(_Widget, {
      config: { exampleConfigProperty: 'a' }
    })
    const { queryByText } = render(<Widget widgetId="Widget_1" />)
    expect(queryByText('exampleConfigProperty: a').tagName).toBe('P')
  })
})
>>>>>>> 8b0cfe1e6d10a3d094da7a454cc49b698496d7a6
