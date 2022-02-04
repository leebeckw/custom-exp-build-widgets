import React, { useState } from "react";
import "./App.css";

const PHOTO_URL =
  "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/close-up-of-cat-wearing-sunglasses-while-sitting-royalty-free-image-1571755145.jpg";

const App: React.FunctionComponent = () => {
  // The content of the target box
  const [content, setContent] = useState<string>("Drop Something Here");

  // This function will be triggered when you start dragging
  const dragStartHandler = (
    event: React.DragEvent<HTMLDivElement>,
    data: string
  ) => {
    event.dataTransfer.setData("text", data);
  };

  // This function will be triggered when dropping
  const dropHandler = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    setContent(data);
  };

  // This makes the third box become droppable
  const allowDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="container">
      <div
        className="box1"
        onDragStart={(event) => dragStartHandler(event, PHOTO_URL)}
        draggable={true}
      >
        <img src={PHOTO_URL}/>
      </div>

      <div
        className="box2"
        onDragStart={(event) => dragStartHandler(event, "Kindacode.com")}
        draggable={true}
      >
      </div>

      <div className="box3" onDragOver={allowDrop} onDrop={dropHandler}>
        {content.endsWith(".jpeg") ? <img src={content} /> : <h2>{content}</h2>}
      </div>
    </div>
  );
};

export default App;