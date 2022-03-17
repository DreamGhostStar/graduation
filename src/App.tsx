import React from 'react';
import routers from "./router/index";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from "react-redux"
import store from 'redux/store';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {
            routers.map((router, index) => {
              return (
                <Route
                  key={index}
                  path={router.path}
                  element={router.component}
                ></Route>
              )
            })
          }
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
