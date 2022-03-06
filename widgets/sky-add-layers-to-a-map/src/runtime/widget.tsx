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
  { id: uuid(), content: "Item 2" },
  { id: uuid(), content: "Item 3" }
];

// unique column spaces
const columnsFromBackend = {
  [uuid()]: {
    name: "First",
    items: itemsFromBackend
  }
};

export default class Widget extends React.PureComponent<AllWidgetProps<any>, any> {
  // state = {
  //   jimuMapView: null,
  //   columns: columnsFromBackend,
  //   items: null
  // };

  constructor(props) {
    super(props);
    this.state = {
      jimuMapView: null,
      columns: columnsFromBackend,
      items: null
    };
    this.onDragEnd = this.onDragEnd.bind(this)
  }

  onDragEnd = (result, columns) => {
    if (!result.destination) return;
    const { source, destination } = result;
    
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);

    this.setState({
      // ...columns,
      // [source.droppableId]: {
      //   ...column,
      //   items: copiedItems
      // }
      copiedItems
    });

    // create a new FeatureLayer
    const layer = new FeatureLayer({
      url: "https://services3.arcgis.com/GzteEaZqBuJ6GIYr/arcgis/rest/services/worldcities/FeatureServer"
    });

    // Add the layer to the map (accessed through the Experience Builder JimuMapView data source)
    this.state.jimuMapView.view.map.add(layer);

    
  };
  

  activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      this.setState({
        jimuMapView: jmv
      });
    }
  };


  render() {
    return (
      <div className="widget-starter jimu-widget">
        {this.props.hasOwnProperty("useMapWidgetIds") && this.props.useMapWidgetIds && this.props.useMapWidgetIds[0] && (
          <JimuMapViewComponent useMapWidgetId={this.props.useMapWidgetIds?.[0]} onActiveViewChange={this.activeViewChangeHandler} />
        )}
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
    );
  }
}

