import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './page/home/home.jsx';
import Profile from './page/profile/profile.jsx';
import Auth from './page/auth/auth.jsx';
import Cart from './page/cart/cart.jsx';
import Plates from './page/plates/plates.jsx';
import Orders from './page/orders/orders.jsx';

const pages = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/profile",
        element: <Profile />
      },
      {
        path: "/auth",
        element: <Auth />
      },
      {
        path: "/cart",
        element: <Cart />
      },
      {
        path: "/plates",
        element: <Plates />
      },
      {
        path: "/orders",
        element: <Orders />
      }
    ]

  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={pages} />
  </StrictMode>,
)
