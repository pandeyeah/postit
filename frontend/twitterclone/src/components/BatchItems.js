import React from "react";
import BatchData from "../BatchData.js";
import  { Toaster } from "react-hot-toast";
//import { useSelector } from "react-redux";
import BatchCard from "./BatchCard.js";

const BatchItems = () => {
  //const category = useSelector((state) => state.category.category);
  //const search = useSelector((state) => state.search.search);
  //const handleToast = (name) => toast.success(`Added ${name} `);
  return (
    <>
      {/* <Toaster position="top-center" reverseOrder={false} /> */}
      <div className="flex flex-wrap gap-10 justify-center bg-slate-200  pt-5  lg:justify-content mx-6 my-10">
        {BatchData.map((food) => (
          <BatchCard
          key={food.id}
            id={food.id}
            name={food.name}
            price={food.price}
            desc={food.desc}
            rating={food.rating}
            img={food.img}
            />
        ))}
      </div>
    </>
  );
};

export default BatchItems;