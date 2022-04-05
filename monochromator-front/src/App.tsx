import React from 'react';
import './App.scss';
import Header from "./Components/Header";
import {Outlet} from "react-router-dom";

function App(): any {

    return (
        <div style={{display: "flex"}}>
            <Header />
            <Outlet/>
        </div>
    );
}

export default App;
