/** @jsx jsx */
import { React, AllWidgetProps, jsx } from "jimu-core";
import {DndContext} from "@dnd-kit/core";
import {useDraggable} from '@dnd-kit/core';
import {useDroppable} from '@dnd-kit/core';
//import {Draggable} from './Draggable.js';
//import {Droppable} from './Droppable.js';

import {CSS} from '@dnd-kit/utilities';

// Defining droppable
function Droppable(props) {
  const {isOver, setNodeRef} = useDroppable({
    id: props.id,
  });
  const style = {
    color: isOver ? 'green' : 'red',
  };

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}

// Defining Draggable
function Draggable(props) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: props.id,
  });
  const style = transform ? {
   transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;
  // const style = {
  //   transform: CSS.Translate.toString(transform),
  // }
  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
}

// Actual widget code
export default class Widget extends React.PureComponent<AllWidgetProps<any>, any> {
  containers = ['A', 'B', 'C'];
  constructor(props) {
    super(props);
    this.state = {
      parent: null
    };
  }
  draggableMarkup = (
    <Draggable id = "draggable">Drag me</Draggable>
  );
  
  render() {
    return (
      <DndContext onDragEnd={handleDragEnd}>
        {this.state.parent === null ? this.draggableMarkup: null}
        {this.containers.map((id) => (
          <Droppable key = {id} id={id}>
            {this.state.parent === id ? this.draggableMarkup : 'Drop here'}
          </Droppable>
        ))}
      </DndContext>
      // <DndContext onDragEnd={handleDragEnd}>
      //   {!this.state.isDropped ? this.draggableMarkup : null}
      //   <Droppable>
      //     {this.state.isDropped ? this.draggableMarkup : 'Drop here'}
      //   </Droppable>
      // </DndContext>
    );
    function handleDragEnd(event) {
      const {over} = event;
      //(over ? this.setState({parent : over.id}) : this.setState({parent : null}));
      if (over){
        this.setState({parent : over.id});
      }
      else {
        this.setState({parent : null});
      }
      // if (event.over && event.over.id === 'droppable') {
      //   this.setState({isDropped: true});
      // }
    }
    
  }
}

