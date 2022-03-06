/** @jsx jsx */
import {AllWidgetProps, jsx } from "jimu-core";
import {DndContext} from "@dnd-kit/core";
import React, { useState } from "react"
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


function App() {
  const containers = ['A', 'B', 'C'];
  const [parent, setParent] = useState(null);
  const draggableMarkup = (
    <Draggable id="draggable">Drag me</Draggable>
  );

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {parent === null ? draggableMarkup : null}

      {containers.map((id) => (
        // We updated the Droppable component so it would accept an `id`
        // prop and pass it to `useDroppable`
        <Droppable key={id} id={id}>
          {parent === id ? draggableMarkup : 'Drop here'}
        </Droppable>
      ))}
    </DndContext>
  );

  function handleDragEnd(event) {
    const {over} = event;

    // If the item is dropped over a container, set it as the parent
    // otherwise reset the parent to `null`
    setParent(over ? over.id : null);
  }
};

export default App;
// Actual widget code
// export default class Widget extends React.PureComponent<AllWidgetProps<any>, any> {
//   containers = ['A', 'B', 'C'];
//   constructor(props) {
//     super(props);
//     this.state = {
//       parent: null
//     };
//   }
//   draggableMarkup = (
//     <Draggable id = "draggable">Drag me</Draggable>
//   );
  
//   render() {
//     return (
//       <DndContext onDragEnd={handleDragEnd}>
//         {this.state.parent === null ? this.draggableMarkup: null}
//         {this.containers.map((id) => (
//           <Droppable key = {id} id={id}>
//             {this.state.parent === id ? this.draggableMarkup : 'Drop here'}
//           </Droppable>
//         ))}
//       </DndContext>
//       // <DndContext onDragEnd={handleDragEnd}>
//       //   {!this.state.isDropped ? this.draggableMarkup : null}
//       //   <Droppable>
//       //     {this.state.isDropped ? this.draggableMarkup : 'Drop here'}
//       //   </Droppable>
//       // </DndContext>
//     );
//     function handleDragEnd(event) {
//       const {over} = event;
//       //(over ? this.setState({parent : over.id}) : this.setState({parent : null}));
//       if (over){
//         this.setState({parent : over.id});
//       }
//       else {
//         this.setState({parent : null});
//       }
//       // if (event.over && event.over.id === 'droppable') {
//       //   this.setState({isDropped: true});
//       // }
//     }
    
//   }
// }

