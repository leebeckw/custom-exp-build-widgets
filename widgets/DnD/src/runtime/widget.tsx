import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { React, AllWidgetProps, jsx } from "jimu-core";
import { render } from 'enzyme';

const rectangles = [
  {
    id: 'First',
    name: 'First',
  },
  {
    id: 'Second',
    name: 'Second'
  }
]

export default class Widget extends React.PureComponent<AllWidgetProps<any>, any>{
  render() {
    return(
    <DragDropContext>
      <Droppable droppableId="characters">
        {(provided) => (
          <ul className="characters" {...provided.droppableProps} ref={provided.innerRef}>
          </ul>
        )}
      </Droppable>
    </DragDropContext>
    );  
  }
}
