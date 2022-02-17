/** @jsx jsx */
import { React, AllWidgetProps, jsx } from "jimu-core";
import { JimuMapViewComponent, JimuMapView } from "jimu-arcgis";
import FeatureLayer from "esri/layers/FeatureLayer";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
// uuid library (universally unique identifier)
// for unique items
// import { v4 as uuid } from 'uuid';

// // unique ids for the items
// const itemsFromBackend = [
//   { id: uuid(), content: "Item 1" },
//   { id: uuid(), content: "Item 2" },
//   { id: uuid(), content: "Item 3" }
// ];

// // unique column spaces
// const columnsFromBackend = {
//   [uuid()]: {
//     name: "First",
//     items: itemsFromBackend
//   }
// };

const getItems = (count) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`
  }));

  // a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250
});

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
      items: getItems(3)
    };
    this.onDragEnd = this.onDragEnd.bind(this)
  }

  onDragEnd(result) {
    // const { source, destination } = result;

    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({ items });

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
            <div>
          <DragDropContext onDragEnd={result => this.onDragEnd(result)}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {this.state.items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          {item.content}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
        </DragDropContext>
      </div>
          </div>
    );
  }
}

