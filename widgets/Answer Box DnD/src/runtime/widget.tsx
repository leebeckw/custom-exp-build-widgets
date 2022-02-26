import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { FeatureLayer } from "esri/layers/FeatureLayer";
import { JimuMapViewComponent, JimuMapView, loadArcGISJSAPIModules } from "jimu-arcgis";
import { AllWidgetProps, jsx, css, React } from "jimu-core";
import ReactDOM from "react-dom";

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

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

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
  constructor(props) {
    super(props);
    this.state = {
      jimuMapView: null,
      items: getItems(3)
    };
    this.onDragEnd = this.onDragEnd.bind(this)
  }


  /**
   * A semi-generic way to handle multiple lists. Matches
   * the IDs of the droppable container to the names of the
   * source arrays stored in the state.
   */
  // id2List = {
  //   droppable: "items",
  // };

  // getList = (id) => this.state[this.id2List[id]];

  // layer = FeatureLayer({
  //   url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads_Styled/FeatureServer/0"
  // });

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

  
    // // Add the layer to the map (accessed through the Experience Builder JimuMapView data source)
    // this.state.jimuMapView.view.map.add(layer);
 
  };

  activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      this.setState({
        jimuMapView: jmv
      });

    }
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
      <div className="widget-starter jimu-widget"> 
       {this.props.hasOwnProperty("useMapWidgetIds") &&
         this.props.useMapWidgetIds &&
          this.props.useMapWidgetIds[0] && (
           <JimuMapViewComponent
             useMapWidgetId={this.props.useMapWidgetIds?.[0]}
             onActiveViewChange={this.activeViewChangeHandler}
           />
         )
       }
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
