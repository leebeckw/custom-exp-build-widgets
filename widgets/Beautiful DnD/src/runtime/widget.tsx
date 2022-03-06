import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { FeatureLayer } from "esri/layers/FeatureLayer";
import { JimuMapViewComponent, JimuMapView, loadArcGISJSAPIModules } from "jimu-arcgis";
import { TextArea } from "jimu-ui";
import { AllWidgetProps, jsx, css, React } from "jimu-core";
import { IMConfig } from "../config";
import { v4 as uuid } from 'uuid';

const {useState} = React;

// unique ids for DnD Items
const itemsFromBackend = [
  { id: uuid(), content: "Item 1" },
  { id: uuid(), content: "Item 2" },
  { id: uuid(), content: "Item 3" }
];

// Unique columns for DnD
const columnsFromBackend = {
  [uuid()]: {
    name: "Answer Bank",
    items: itemsFromBackend
  },
  [uuid()]: {
    name: "Blank",
    items: []
  }
};


export default function Widget(props: AllWidgetProps<IMConfig>) {
  // Setting states using hooks
  const [columns, setColumns] = useState(columnsFromBackend);
  const [jimuMapView, setJimuMapView] = useState(null);
  const [featureLayerOnMap, setFeatureLayerOnMap] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(null);

  // determine if column is locked or not

  // Setting up active view change handler
  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      setJimuMapView(jmv);
    }
  };

  // TODO: Trying to add feature layer
  // When the FeatureLayer function is called, we get a "Failed to Load" error
  // --------Comment this portion out to see what DnD looks like----------
  // const featureLayer = new FeatureLayer({
  //   url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads_Styled/FeatureServer/0"
  // });
  // jimuMapView.view.map.add(featureLayer);
  //---------------------------------------------------------------------

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
          props.useMapWidgetIds.length[0] && (
            <JimuMapViewComponent
              useMapWidgetId={props.useMapWidgetIds}
              onActiveViewChange={activeViewChangeHandler}
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
                          padding: 10,
                          width: 250,
                          minHeight: 250
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
