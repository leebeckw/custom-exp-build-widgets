/** @jsx jsx */
import defaultMessages from "./translations/default";
import { IMConfig } from "../config";
import FeatureLayer from "esri/layers/FeatureLayer";
import { JimuMapViewComponent, JimuMapView } from "jimu-arcgis";
import { React, AllWidgetProps, jsx } from "jimu-core";
import { Button } from 'jimu-ui';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const checkArraySimilar = (arr, threshold = 0.25) => {
  /*
   * Checks similarity of array to initial text input by comparing the
   * current element index to element id, which corresponds to inital index.
   * 
   * Inputs
   *    arr <[dict]> 
   *        each item is a dictionary with id and content keys
   *    threshold <float> 
   *        float between 0 and 1
   * 
   * Returns
   *    if the proportion of items in array similar to the initial configuration
   *    is greater or equal to the threshold, return true; else false.
   */
  let count = 0;
  for (const [index, element] of arr.entries()){
    if (index == element.id) {
      count = count + 1;
    }
  };
  return count/arr.length >= threshold;
};

const shuffleItems = (items) => {
  /*
   * Shuffles all items provided and returns them in shuffled order.
   * The shuffled array must be at least 50% different from original array
   *
   * Inputs
   *    items <[dict]> each item is a dictionary with id and content keys
   * Returns
   *    returns shuffled items array - the id and content of each item is unchanged
   */
  let shuffled_items = items;
  if (items.length > 1) {
    while (checkArraySimilar(shuffled_items, 0.50)) {  // shuffle until 50% diffrent
      shuffled_items.sort(() => Math.random() - 0.5);
    };
  };
  return shuffled_items

}


const reorder = (items, startIndex, endIndex) => {
/*
 * Reorders items when they are dragged to a new position
 * within the list and returns the reordered list
 *
 * Inputs
 *    items <[dict]> each item is a dictionary with id and content keys
 *    startIndex <int> index of item to be moved
 *    endIndex <int> new index of item to be moved
 * Returns
 *    Reordered items
 */

  const result = Array.from(items);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const grid = 8;  // determines size of blocks within widget

const getItemStyle = (isLocked,isDragging, draggableStyle) => ({
  /*
   * Style for a draggable item.
   *
   * Inputs
   *    isLocked <Boolean> true if correct answer has been reached, widget locked
   *    isDragging <Boolean> true if draggable element is being dragged
   *    dragagbleStyle - provided draggable style
   * 
   * Returns
   *    None
   */
  // some basic styles to make the draggable items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isLocked ? "#93C572" : 
                         isDragging ? "#5F9EA0" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = () => ({
  /*
   * Style for droppable area that hold draggable items
   *
   * Inputs
   *    isLocked <Boolean> true if correct answer has been reached, widget locked
   *    isDraggingOver <Boolean> true if the droppable is being dragged over
   */
  background: "lightgrey",
  padding: grid,
  width: 250
});

// Widget Inferface -  allows these elements to be availible for use in widget
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

  initalizeItems(){
    /*
     * Creates items based in the text in the configuration variable
     * called instructText (this.props.config.instructText)
     */
    this.props.config.isClicked = false;  // resets button in settings panel
    let count = 0;
    let instructions = this.props.config.instructText;  // text to make into items
  
    if (instructions != undefined){
      count = instructions.length;  // if instructText is not an empty string
    }

    let arr = Array.from({ length: count }, (v, k) => k).map((k) => ({
      id: `${k}`,  // Id is the order the item SHOULD be in - initial order
      content: `${instructions[k]}`  // split by new line - controlled in settings
    }))

    return shuffleItems(arr);
  }

  getItems() {
    /*
     * Gets items within widget when widget is re-rendered. If the
     * 'update instruction' button in the settings panel has been
     * clicked, reinitialize items. Else, return current items.
     */
    if (this.props.config.isClicked) {  // updated instructions
      let shuffledArr = this.initalizeItems();
      this.setState({items: shuffledArr})  // update items
      return shuffledArr;
    }
    else {
      return this.state.items;  // return current items
    }
  };

  formSubmit = (evt) => {
    /*
     * When 'check answer' button is clicked, formSubmit is called to
     * check answer and update the number of tries
     */
    evt.preventDefault();
    this.setState({tries: this.state.tries + 1});   // increase number of tries

    if (checkArraySimilar(this.state.items, 1.0)) {  // if items in original order
      try{
        // create a new FeatureLayer
        const layer = new FeatureLayer({
          url: this.props.config.layerUrls // can only add 1 right now! 
        });
        // Add the layer to the map (accessed through the Experience Builder JimuMapView data source)
        this.state.jimuMapView.view.map.add(layer);
      }
      finally {
        this.setState({isLocked: true})  // Lock the draggable area
      }
    }
    else{
      window.alert("Try again!")  // if answer is wrong
    }
  }
  
  onDragEnd(result) {
    /*
     * When draggable items is dropped, if it is dropped outside of a
     * draggable area, return to initial position. Else, reorder items
     * within the widget. 
     */
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(  // reorders widget items
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({items: items});  // saves new order within the state
  };
  
  activeViewChangeHandler = (jmv: JimuMapView) => {
    /*
     * Instrumental to updating the map when the drag and drop
     * widget is connected to the map 
     */
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
                  style={getListStyle()}
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

