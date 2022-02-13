/** @jsx jsx */
import { React, AllWidgetProps, jsx } from "jimu-core";
import { JimuMapViewComponent, JimuMapView } from "jimu-arcgis";
import FeatureLayer from "esri/layers/FeatureLayer";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
// uuid library (universally unique identifier)
// for unique items
import { v4 as uuid } from 'uuid';

// unique ids for the items
const itemsFromBackend = [
  { id: uuid(), content: "Item 1" },
  { id: uuid(), content: "Item 2" }
];

// unique column spaces
const columnsFromBackend = {
  [uuid()]: {
    name: "First",
    items: itemsFromBackend
  },
  [uuid()]: {
    name: "Second",
    items: []
  },
};

export default class Widget extends React.PureComponent<AllWidgetProps<any>, any> {
  state = {
    jimuMapView: null,
    columns: columnsFromBackend,
    items: null
  };

  onDragEnd = (result, columns) => {
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
      this.setState({
        ...this.state.columns,
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
      const column = this.state.columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      this.setState({
        ...this.state.columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      });

      // create a new FeatureLayer
      const layer = new FeatureLayer({
        url: "https://services3.arcgis.com/GzteEaZqBuJ6GIYr/arcgis/rest/services/worldcities/FeatureServer"
      });

      // Add the layer to the map (accessed through the Experience Builder JimuMapView data source)
      this.state.jimuMapView.view.map.add(layer);

    }
  };
  

  activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      this.setState({
        jimuMapView: jmv
      });
    }
  };

  // formSubmit = (evt) => {
  //   evt.preventDefault();

  //   // create a new FeatureLayer
  //   const layer = new FeatureLayer({
  //     url: "https://services3.arcgis.com/GzteEaZqBuJ6GIYr/arcgis/rest/services/worldcities/FeatureServer"
  //   });

  //   // Add the layer to the map (accessed through the Experience Builder JimuMapView data source)
  //   this.state.jimuMapView.view.map.add(layer);
  // };

  render() {
    return (
      <div className="widget-starter jimu-widget">
        {this.props.hasOwnProperty("useMapWidgetIds") && this.props.useMapWidgetIds && this.props.useMapWidgetIds[0] && (
          <JimuMapViewComponent useMapWidgetId={this.props.useMapWidgetIds?.[0]} onActiveViewChange={this.activeViewChangeHandler} />
        )}

          <div>
            <DragDropContext onDragEnd={result => this.onDragEnd(result, this.state.columns)}>
          {Object.entries(this.state.columns).map(([columnId, column], index) => {
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
                <div style={{ margin: 5 }}>
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
      </div>
    );
  }
}

