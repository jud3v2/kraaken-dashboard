import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import axios from 'axios';
import {config} from './config'
//
import App from './App';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';

// ----------------------------------------------------------------------

// Ajoute le token a chaque requete lorsqu'il est disponible dans le local storage
axios.interceptors.request.use(config => {
    if(localStorage.getItem('token')){
        const token = localStorage.getItem('token')
        config.headers.authorization = `Bearer ${token}`;
    }
    return config;
})

// Définit l'URL de base de l'API
axios.defaults.baseURL = config.apiURL;


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<RecoilRoot><App /></RecoilRoot>);

// If you want to enable client cache, register instead.
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
