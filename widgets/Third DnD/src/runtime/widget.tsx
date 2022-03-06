import * as React from "react";
import {
  List,
  arrayMove,
  arrayRemove
} from "baseui/dnd-list";
import {Popover} from 'baseui/popover';

export default () => {

  const [items, setItems] = React.useState([
    "Item 1",
    "Item 2",
    "Item 3"
  ]);

  return (
    <>
      <List
        items={items}
        onChange={({ oldIndex, newIndex }) =>
          setItems(
            newIndex === -1
              ? arrayRemove(items, oldIndex)
              : arrayMove(items, oldIndex, newIndex)
          )
        }
      />
      {items}
    </>
  );
}