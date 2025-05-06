import { createBrowserRouter,
  RouterProvider,
 } from "react-router";
import { createRoot } from 'react-dom/client'
import App from "./App";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
]);

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
