import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import FeatureLayer from "esri/layers/FeatureLayer";
import { JimuMapViewComponent, JimuMapView, loadArcGISJSAPIModules } from "jimu-arcgis";
import { AllWidgetProps, jsx, css } from "jimu-core";
import { IMConfig } from "../config";
// uuid library (universally unique identifier)
// for unique items
import { v4 as uuid } from 'uuid';

interface IState {
  jimuMapView: JimuMapView;
  featureLayerOnMap: FeatureLayer;
  featureServiceUrlInput: string;
}

// unique ids for the items
const itemsFromBackend = [
  { id: uuid(), content: "Item 1" },
  { id: uuid(), content: "Item 2" },
  { id: uuid(), content: "Item 3" }
];

// unique column spaces
const columnsFromBackend = {
  [uuid()]: {
    name: "To-do",
    items: itemsFromBackend
  },
  [uuid()]: {
    name: "In Progress",
    items: []
  },
  [uuid()]: {
    name: "Done",
    items: []
  }
};


// When dragged
// const onDragEnd = (result, columns, setColumns) => {
//   if (!result.destination) return;
//   const { source, destination } = result;

//   // If the source and destination of an item is different
//   if (source.droppableId !== destination.droppableId) {
//     const sourceColumn = columns[source.droppableId];
//     const destColumn = columns[destination.droppableId];
//     const sourceItems = [...sourceColumn.items];
//     const destItems = [...destColumn.items];

//     //removes the first index of the array (so things can move up)
//     const [removed] = sourceItems.splice(source.index, 1);
    
//     // Insert removed element
//     destItems.splice(destination.index, 0, removed);

//     // Set the columns with the new items and order
//     // ... means to expand the argument or variable
//     setColumns({
//       ...columns,
//       [source.droppableId]: {
//         ...sourceColumn,
//         items: sourceItems
//       },
//       [destination.droppableId]: {
//         ...destColumn,
//         items: destItems
//       }
//     });

//     // Create and add the new Feature Layer
//     const featureLayer = new FeatureLayer({
//       url: evt.target.value,
//     });
//     JimuMapView.view.map.add(featureLayer);
//     setFeatureLayerOnMap({
//       featureLayerOnMap: featureLayer,
//     });

//   }
  
//   // If source and destination is the same
//   else {
//     const column = columns[source.droppableId];
//     const copiedItems = [...column.items];
//     const [removed] = copiedItems.splice(source.index, 1);
//     copiedItems.splice(destination.index, 0, removed);
//     setColumns({
//       ...columns,
//       [source.droppableId]: {
//         ...column,
//         items: copiedItems
//       }
//     });
//   }


// };

export default function Widget(props: AllWidgetProps<IMConfig>) {
  // Use the solumns from the constant declared earlier
  const [columns, setColumns] = useState(columnsFromBackend);
  const [jimuMapView, setJimuMapView] = useState(null);
  const [featureLayerOnMap, setFeatureLayerOnMap] = useState(null);

  // const featureLayer = new FeatureLayer({
  //   url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads_Styled/FeatureServer/0"
  // });
  // jimuMapView.view.map.add(featureLayer);

  // When dragged
  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;

    // If the source and destination of an item is different
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];

      //removes the first index of the array (so things can move up)
      const [removed] = sourceItems.splice(source.index, 1);
      
      // Insert removed element
      destItems.splice(destination.index, 0, removed);

      // Set the columns with the new items and order
      // ... means to expand the argument or variable
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      });

      // // Create and add the new Feature Layer
      // jimuMapView.view.map.add(featureLayer);
      // setFeatureLayerOnMap({
      //   featureLayerOnMap: featureLayer,
      // });
    }
    
    // If source and destination is the same
    else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      });
    }
  };


  return (
    <div className="widget-dnd map" style={{ display: "flex", justifyContent: "center", height: "100%" }}>

        {props.hasOwnProperty("useMapWidgetIds") &&
        props.useMapWidgetIds &&
          props.useMapWidgetIds.length === 1 && (
            <JimuMapViewComponent
              useMapWidgetId={props.useMapWidgetIds?.[0]}
              onActiveViewChange={onDragEnd}
            />
          )}



      <DragDropContext
        onDragEnd={result => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
              key={columnId}
            >
              <h2>{column.name}</h2>
              <div style={{ margin: 8 }}>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "lightblue"
                            : "lightgrey",
                          padding: 4,
                          width: 250,
                          minHeight: 500
                        }}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      userSelect: "none",
                                      padding: 16,
                                      margin: "0 0 8px 0",
                                      minHeight: "50px",
                                      backgroundColor: snapshot.isDragging
                                        ? "#263B4A"
                                        : "#456C86",
                                      color: "white",
                                      ...provided.draggableProps.style
                                    }}
                                  >
                                    {item.content}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}

// export default App;
