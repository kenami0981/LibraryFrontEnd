import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import App from "./App";
import BooksList from "./Components/BooksList";
import BookDetails from "./Components/BookDetails";
import BookForm from "./Components/BookForm";
import AuthorsList from "./Components/AuthorsList";
import AuthorDetails from "./Components/AuthorDetails";
import AuthorForm from "./Components/AuthorForm";
//import NotFound from "./Components/NotFound";
import Login from "./Components/Login";
import Register from "./Components/Register";

export const routes: RouteObject[] = [
    {
        path: "/",
        element: <App />,
        children: [
            {path: 'books', element: <BooksList />},
            {path: 'books/:id', element: <BookDetails />},
            {path: 'editbooks/:id', element: <BookForm />},
            {path: 'add-book', element: <BookForm />},
            {path: 'authors', element: <AuthorsList />},
            {path: 'authors/:id', element: <AuthorDetails />},
            {path: 'editauthor/:id', element: <AuthorForm />},
            {path: 'add-author', element: <AuthorForm />},
            {path: '', element: <BooksList/>},
            //{path: 'not-found', element: <NotFound />},
            {path: 'login', element: <Login/>},
            {path: 'register', element: <Register/>},
            //{path: '*', element: <Navigate replace to='/not-found' />}


        ]
    }
]
export const router = createBrowserRouter(routes);