import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Amperage from "./Pages/Amperage/Amperage";
import Count from "./Pages/Count/Count";
import History from "./Pages/History/History";
import store from "./store";
import {Provider} from "react-redux";


ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<App/>}>
                        <Route path="amperage" element={<Amperage/>}/>
                        <Route path="count" element={<Count/>}/>
                        <Route path="history" element={<History/>}/>
                        <Route path="*" element={<Amperage/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

