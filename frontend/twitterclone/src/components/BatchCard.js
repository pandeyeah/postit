import React from "react";
import { AiFillStar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
// import { useDispatch } from "react-redux";
// import { addToCart } from "../redux/slices/CartSlice";

const BatchCard = ({ id, name, price, desc, img, rating }) => {
  //   const dispatch = useDispatch();
// const navigate = useNavigate();
const cost=10;
const checkout = async () => {
  try {
    console.log('hi1');
    axios.defaults.withCredentials = true;
    
    const res = await axios.post(`${USER_API_END_POINT}/checkout`,{cost});
    console.log('hi2');
    const { url } = res.data; 
    console.log('hi3'); // Destructure url from res.data
    window.location.href = url;  // Redirect to Stripe checkout page
  } catch (error) {
    console.error('Checkout error:', error);
    alert('Something went wrong, please try again.');
  }
};

  return (
    <div className=" font-bold w-[250px] bg-white p-5 flex flex-col rounded-lg gap-2 shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105">
      <img
        src={img}
        alt=""
        className="w-auto h-[130px] hover:scale-110 cursor-grab transition-all duration-500 ease-in-out"
      />
      <div className="text-sm flex justify-between">
        <h2>{name}</h2>
        <span className="text-green-500">₹{price}</span>
      </div>
      <p className="text-sm font-normal">{desc.slice(0, 60)}</p>
      <div className="flex justify-between">
        <span className="flex justify-center items-center">
          <AiFillStar className="mr-1 text-yellow-400" /> {rating}
        </span>
         <button
           onClick={checkout}
          className="p-1 text-white bg-green-500  hover:bg-blue-500 rounded-lg text-sm"
        >
          Book
        </button> 
      </div>
    </div>
  );
};

export default BatchCard;
