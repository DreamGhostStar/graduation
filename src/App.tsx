import React from 'react';
import routers from "./router/index";
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Provider } from "react-redux"
import store from 'redux/store';

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
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
          <Route path="*" element={<Navigate to="/home/post" />} />
        </Routes>
      </HashRouter>
    </Provider>
  );
}

export default App;
