import { Text } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "../layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Text color={"black"}>Home</Text>,
      },
      {
        path: "/products",
        element: <Text color={"black"}>Products</Text>,
      },
    ],
  },
]);
