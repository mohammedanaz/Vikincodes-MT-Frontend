import { createRoot } from 'react-dom/client'
import "./axios/Interceptors.jsx"
import { Provider } from "react-redux";
import { persistor, store } from "./redux/stores/store";
import { PersistGate } from "redux-persist/lib/integration/react";
import './index.css'
import App from './App.jsx'
import CircleSpinner from './components/Spinners/CircleSpinner'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={<CircleSpinner />} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
)
