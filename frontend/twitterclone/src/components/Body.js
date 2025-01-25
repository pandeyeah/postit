import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './Login';
import Home from './Home';
import Feed from './Feed';
import Profile from './Profile';
import BatchItems from './BatchItems';
import Booking from './Booking';
import ContactMe from './ContactMe';
import Success from './Success';

const Body = () => {
    const appRouter = createBrowserRouter([
        {
            path: "/",
            element: <Home/>,
            children:[
                {
                    path:"/",
                    element:<Feed/>
                },
                {
                    path:"/profile/:id",
                    element:<Profile/>
                }
                
            ]
        },
        {
            path: "/login",
            element: <Login />
        },
        {
            path: "/batches",
            element: <BatchItems/>
        },
        {
            path: "/booking",
            element: <Booking/>
        },
        {
            path: "/contactme",
            element: <ContactMe/>
        },
        {
            path: "/success",
            element: <Success/>
        },
    ])
    return (
        <div>
            <RouterProvider router={appRouter} />
        </div>
    )
}

export default Body