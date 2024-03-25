import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    element: <div>Home</div>,
    children: [
      {
        path: "posts",
        element: <div>Posts</div>,
      },
    ],
  },
]);

export default router;
