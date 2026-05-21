import { Text, VStack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export const Layout = () => {
  return (
    <VStack>
      <Navbar />
      <Outlet />
    </VStack>
  );
};
