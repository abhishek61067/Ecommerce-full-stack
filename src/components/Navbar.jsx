import { useColorMode } from "@chakra-ui/react";
import {
  Badge,
  Box,
  HStack,
  IconButton,
  Image,
  Link,
  Spacer,
  Text,
} from "@chakra-ui/react";
import logo from "/logo/ecommerce-logo.svg";
import { Moon, Router, ShoppingCart, Sun } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
export const Navbar = () => {
  // get the state for cart store
  const cart = useCartStore((state) => state.cart);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box
      bg={"bg"}
      px={8}
      py={4}
      shadow={"sm"}
      position={"sticky"}
      top={0}
      zIndex={10}
      w="full"
    >
      <HStack spacing={8} alignItems="center">
        {/* logo */}
        <Link as={RouterLink} to={"/"} style={{ textDecoration: "none" }}>
          <HStack spacing={1}>
            <Image src={logo} alt="logo" boxSize={"30px"} />
            <Text fontweight={"medium"} fontSize={"xl"} color="primary">
              E-Shop
            </Text>
          </HStack>
        </Link>

        {/* links */}
        <HStack spacing={4}>
          <Link as={RouterLink} to={"/"} color={"text"} fontweight="semibold">
            Home
          </Link>
          <Link
            as={RouterLink}
            to={"/products"}
            color={"text"}
            fontweight="semibold"
          >
            Products
          </Link>
        </HStack>
        <Spacer />

        {/* cart items */}
        <Box pos={"relative"}>
          <IconButton
            to="/cart"
            variant={"ghost"}
            icon={<ShoppingCart size={20} />}
            as={RouterLink}
          />
          {totalItems > 0 && (
            <Badge
              position={"absolute"}
              top={-1}
              right={-1}
              bg={"brand.300"}
              color={"white"}
              rounded={"full"}
              fontSize={"0.7rem"}
              px={2}
            >
              {totalItems}
            </Badge>
          )}
        </Box>
        {/* dark/light mode toggle */}
        <IconButton
          icon={colorMode === "light" ? <Moon size={20} /> : <Sun size={20} />}
          variant={"ghost"}
          onClick={toggleColorMode}
        />
      </HStack>
    </Box>
  );
};
