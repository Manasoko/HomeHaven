import React from "react";
import ProductCard from "./test1.jsx";

const images = ["https://www.villaafrika.com/wp-content/uploads/2019/11/homes-in-nigeria.jpg/", "src/assets/images/house1.jpg", "src/assets/images//house3.jpg"]; 

const Test = () => {
  return (
    <div className="p-5">
      <ProductCard productImages={images} />
    </div>
  );
};

export default Test;
