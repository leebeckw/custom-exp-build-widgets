/** @jsx jsx */
import { React, AllWidgetProps, jsx } from "jimu-core";
import { JimuMapViewComponent, JimuMapView } from "jimu-arcgis";
import FeatureLayer from "esri/layers/FeatureLayer";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { IMConfig } from "../config";
import defaultMessages from "./translations/default";


// Checks if array is properly shuffled for greater than 50% shuffled
// True if NOT properly shuffled
// We compare index of the item to its id

// Returns true of the array and id is too similar
// Threshold needs to be between 0 and 1
const checkArraySimilar = (arr, threshold = 0.25) => {
  let count = 0;
  
  for (const [index, element] of arr.entries()){
    if (index == element.id) {
      count = count + 1;
    }
  };
  return count/arr.length >= threshold;
};


const getItems = (instructions) => {
  let count = instructions.length;

  const arr = Array.from({ length: count }, (v, k) => k).map((k) => ({
    // Id is the order the item SHOULD be in
    id: `${k}`,
    content: `${instructions[k]}`
  }))
  const shuffled_arr = arr;

  if (arr.length > 1) {
    while (checkArraySimilar(shuffled_arr, 0.25)) {
      shuffled_arr.sort(() => Math.random() - 0.5);
    };
  };
  return shuffled_arr
};


// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;


const getItemStyle = (isLocked,isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isLocked ? "#93C572" : 
                         isDragging ? "#5F9EA0" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = (isLocked, isDraggingOver) => ({
  background: isLocked? "lightgrey" : "lightgrey",
  padding: grid,
  width: 250
});

interface IState {
  jimuMapView: JimuMapView;
  featureLayerOnMap: FeatureLayer;
}

export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig>, IState> {
  // state = {
  //   jimuMapView: null,
  //   columns: columnsFromBackend,
  //   items: null
  // };

  constructor(props) {
    super(props);
    this.state = {
      jimuMapView: null,
      // items: getItems(["For every square mile",
      //                   "If elevation higher than 0",
      //                   "Color tile shade of green",
      //                   "else",
      //                   "Color the tile a shade of gray"]),
      items: getItems([ "For every square mile",
                        "If elevation higher than 0",
                        "Color tile shade of green",
                        "else",
                        "Color the tile a shade of gray"]),
      isLocked: false
    };
    this.onDragEnd = this.onDragEnd.bind(this)
  }


  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({items: items});

    if (checkArraySimilar(items, 1.0)) {
      // create a new FeatureLayer
      const layer = new FeatureLayer({
        url: "https://services3.arcgis.com/GzteEaZqBuJ6GIYr/arcgis/rest/services/Simplified_Global_Elevation/FeatureServer"
      });

      // Add the layer to the map (accessed through the Experience Builder JimuMapView data source)
      this.state.jimuMapView.view.map.add(layer);

      // Lock the draggable area
      this.setState({isLocked: true})
    }  

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
                  style={getListStyle(this.state.isLocked, snapshot.isDraggingOver)}
                >
                  {this.state.items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                      isDragDisabled={this.state.isLocked}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            this.state.isLocked,
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
