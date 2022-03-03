/** @jsx jsx */
import { React, AllWidgetProps, jsx } from "jimu-core";
import { JimuMapViewComponent, JimuMapView } from "jimu-arcgis";
import FeatureLayer from "esri/layers/FeatureLayer";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { IMConfig } from "../config";
import defaultMessages from "./translations/default";
import { Button } from 'jimu-ui';
import { left } from "@popperjs/core";


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

const shuffleItems = (items) => {
  let shuffled_items = items;
  if (items.length > 1) {
    while (checkArraySimilar(shuffled_items, 0.50)) {
      shuffled_items.sort(() => Math.random() - 0.5);
    };
  };
  return shuffled_items

}


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
  left: 100,

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
  constructor(props) {
    super(props);
    this.state = {
      jimuMapView: null,
      items: this.initalizeItems(),
      isLocked: false,
      tries: 0
    };
    this.onDragEnd = this.onDragEnd.bind(this)
  }


  formSubmit = (evt) => {
    evt.preventDefault();
    this.setState({tries: this.state.tries + 1})

    if (checkArraySimilar(this.state.items, 1.0)) {

      try{
        // create a new FeatureLayer
        const layer = new FeatureLayer({
          url: this.props.config.layerUrls // can only add 1 right now! 
        });

        // Add the layer to the map (accessed through the Experience Builder JimuMapView data source)
        this.state.jimuMapView.view.map.add(layer);
      }
      finally {
        // Lock the draggable area
        this.setState({isLocked: true})
      }
    }

    else{
      window.alert("Try again!")
    }
  }

  initalizeItems(){
    this.props.config.isClicked = false;

      let count = 0;
      let instructions = this.props.config.instructText;
  
      if (instructions != undefined){
        count = instructions.length;
      }
    
      let arr = Array.from({ length: count }, (v, k) => k).map((k) => ({
        // Id is the order the item SHOULD be in
        id: `${k}`,
        content: `${instructions[k]}`
      }))
    
      let shuffledArr = shuffleItems(arr);

      return shuffledArr;
  }

  getItems() {
    if (this.props.config.isClicked) {
    
      let shuffledArr = this.initalizeItems();

      try {
        this.setState({items: shuffledArr})
      }
      finally {
        return shuffledArr;
      }
    }

    else {
      return this.state.items;
    }
  };
  

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
                  {this.getItems().map((item, index) => (
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
      <form onSubmit={this.formSubmit}>
        <div>
          <Button type="primary" style={{background: 'orange', color: "#ffffff"}} >Check Answer!</Button>
          {this.state.isLocked && <p>Congrats! You got the right answer!</p>}
          {<p>Number of Tries: {this.state.tries}</p>}
        </div>
      </form>
    </div>
    );
  }
}

