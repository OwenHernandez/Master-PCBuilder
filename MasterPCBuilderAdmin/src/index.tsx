import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Router from "./Components/Router";
import AppContextProvider from './Contexts/AppContextProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import {ApolloClient, InMemoryCache, ApolloProvider, ApolloLink, createHttpLink} from '@apollo/client';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const authLink = new ApolloLink((operation, forward) => {
    // Retrieve the authentication token from local storage if it exists
    const token = localStorage.getItem('authToken');

    // Use the setContext method to set the HTTP headers.
    operation.setContext({
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
            // Add other headers here as needed
        }
    });

    return forward(operation);
});
const httpLink = createHttpLink({
    uri: 'http://localhost:8080/graphql',
});
const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

root.render(
    <ApolloProvider client={client}>
        <AppContextProvider>
            <Router />
        </AppContextProvider>
    </ApolloProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
