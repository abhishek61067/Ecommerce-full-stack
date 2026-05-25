"use client";
import React, { use, useState } from "react";
import {
  Box,
  Image,
  Text,
  Button,
  Spinner,
  Center,
  useColorModeValue,
  HStack,
  VStack,
  Stack,
  Input,
  Divider,
  FormLabel,
  Heading,
  Tooltip,
} from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import { useCartStore } from "../store/cartStore";
import { useGetProductList } from "../services/products";
import axios from "axios";
import { dark, green } from "../constants/index";
import {
  Cross,
  DeleteIcon,
  SeparatorHorizontal,
  SeparatorHorizontalIcon,
  Trash,
  Trash2,
} from "lucide-react";

const CartPage = () => {
  const { data, isLoading, isError, error } = useGetProductList();

  const cart = useCartStore((state) => state.cart); // [{id, quantity}]
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const [address, setAddress] = useState({
    name: "",
    street: "",
  });

  const bgColor = useColorModeValue("white", "gray.800");
  const tableBgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.800", "white");
  const errorColor = useColorModeValue("red.500", "red.300");

  if (isLoading) {
    return (
      <Center h="70vh">
        <Spinner size="xl" color="brand.400" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Center h="70vh">
        <Text color={errorColor}>
          Error: {error?.message || "Something went wrong"}
        </Text>
      </Center>
    );
  }

  const products = data?.products || [];

  const cartItems = cart
    .map((cartItem) => {
      const product = products.find((p) => p.id === cartItem.id);
      if (!product) return null;
      return { ...product, quantity: cartItem.quantity };
    })
    .filter(Boolean);
  console.log("🚀 ~ CartPage ~ cartItems:", cartItems);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const discount = subtotal * 0.1; // 10% discount
  const shipping = subtotal > 50 ? 0 : 2;
  const total = subtotal + shipping - discount;

  const increment = (id, qty) => updateQuantity(id, qty + 1);
  const decrement = (id, qty) => {
    if (qty > 1) updateQuantity(id, qty - 1);
  };

  // const handleCheckout = async () => {
  //   if (!address.name || !address.street) {
  //     alert("Please fill in your name and street address!");
  //     return;
  //   }

  //   try {
  //     const res = await axios.post(
  //       "http://localhost:5000/create-checkout-session",
  //       {
  //         cartItems,
  //         deliveryAddress: address, // send only name and street for now
  //       },
  //     );

  //     const { url } = res.data;
  //     window.location.href = url;
  //   } catch (err) {
  //     console.error(err);
  //     alert("Checkout failed. Please try again.");
  //   }
  // };

  return (
    <Box p={8} bg={bgColor}>
      <Text fontSize="2xl" fontWeight="bold" mb={6} color={textColor}>
        Your Cart
      </Text>

      {cartItems.length === 0 ? (
        <Text color={textColor}>Your cart is empty.</Text>
      ) : (
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={8}
          align="flex-start"
        >
          <Box
            flex="2"
            maxH="500px"
            overflowY="auto"
            bg={useColorModeValue("gray.50", "dark")}
            borderRadius="md"
            rounded="xl"
            shadow="xl"
          >
            <TableContainer>
              <Table variant="simple">
                <Thead
                  position="sticky"
                  top={0}
                  bg={useColorModeValue("gray.50", "dark")}
                  zIndex={1}
                >
                  <Tr>
                    <Th textAlign="center">Product</Th>
                    <Th textAlign="center">Price</Th>
                    <Th textAlign="center">Quantity</Th>
                    <Th textAlign="center">Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {cartItems.map((item) => (
                    <Tr key={item.id}>
                      <Td>
                        <HStack>
                          <Image
                            boxSize="80px"
                            src={item.thumbnail}
                            alt={item.title}
                            objectFit="cover"
                          />
                          <Text color={textColor}>{item.title}</Text>
                        </HStack>
                      </Td>
                      <Td>
                        <Text color={textColor}>${item.price.toFixed(2)}</Text>
                      </Td>
                      <Td>
                        <HStack>
                          <Button
                            size="sm"
                            onClick={() => decrement(item.id, item.quantity)}
                          >
                            -
                          </Button>
                          <Input
                            value={item.quantity}
                            size="sm"
                            width="50px"
                            textAlign="center"
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              if (!isNaN(val) && val > 0) {
                                updateQuantity(item.id, val);
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            onClick={() => increment(item.id, item.quantity)}
                          >
                            +
                          </Button>
                        </HStack>
                      </Td>
                      <Td>
                        <Tooltip label="Remove from cart">
                          <Button
                            colorScheme="brand"
                            onClick={() => removeFromCart(item.id)}
                            size={"sm"}
                          >
                            <Trash2 size={"15px"} />
                          </Button>
                        </Tooltip>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </Stack>
      )}
    </Box>
  );
};

export default CartPage;
