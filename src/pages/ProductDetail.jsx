import React from "react";
import { useGetProductDetail } from "../services/products";
import { useParams } from "react-router-dom";
import {
  Box,
  Center,
  Spinner,
  Text,
  VStack,
  Grid,
  GridItem,
  Image,
  Badge,
  Heading,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
} from "@chakra-ui/react";
import { primary } from "../constants";
import Tilt from "react-parallax-tilt";
import { ShoppingCart, Star } from "lucide-react";
import { useCartStore } from "../store/cartStore";

const ProductDetail = () => {
  const { id } = useParams();
  const { data, isLoading, error, isError } = useGetProductDetail(id);
  console.log("🚀 ~ ProductDetail ~ data:", data);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [quantity, setQuantity] = React.useState(1);

  // add to cart handler
  const addToCartHandler = () => {
    useCartStore.getState().addToCart(data.id, quantity);
  };

  if (isLoading) {
    return (
      <Center py={20}>
        <Spinner size="xl" color="brand.400" />
      </Center>
    );
  }
  if (isError) {
    return (
      <Center py={20}>
        <Text color={"red.500"}>Failed to load products</Text>
      </Center>
    );
  }
  //   product details
  const {
    title,
    description,
    price,
    rating,
    thumbnail,
    images,
    stock,
    category,
  } = data;
  const mainImage = selectedImage || images[0];
  console.log("🚀 ~ ProductDetail ~ mainImage:", mainImage);
  return (
    <VStack
      h={"90vh"}
      maxW="6xl"
      mx="auto"
      px={6}
      py={10}
      justifyContent="center"
    >
      <Grid templateColumns={{ base: "1fr", md: "120px 1fr 1fr" }} gap={10}>
        {/* Thumbnails */}
        <GridItem>
          <VStack spacing={3} alignItems="center">
            {images?.map((img, idx) => {
              return (
                <Image
                  key={idx}
                  src={img}
                  alt={`${title} ${idx}`}
                  boxSize="100px"
                  objectFit="cover"
                  borderRadius="md"
                  cursor="pointer"
                  border={
                    mainImage === img
                      ? `2px solid ${primary}`
                      : "1px solid #E2E8F0"
                  }
                  transition={"transform 0.25s"}
                  _hover={{
                    transform: "scale(1.05) rotate(5deg)",
                  }}
                  onClick={() => setSelectedImage(img)}
                />
              );
            })}
          </VStack>
        </GridItem>
        {/* Main image */}
        <GridItem>
          <Tilt
            glareEnable={true}
            glareMaxOpacity={0.0}
            scale={1.5}
            transitionSpeed={1500}
            tiltMaxAngleX={30}
            tiltMaxAngleY={40}
            className="w-[300px]"
          >
            <Image
              src={mainImage}
              alt={title}
              w="100%"
              h="400px"
              objectFit="cover"
              borderRadius="md"
            />
          </Tilt>
        </GridItem>
        {/* Product details */}
        <GridItem>
          <VStack align="flex-start" spacing={4}>
            <Heading size="lg" color="text">
              {title}
            </Heading>
            <Badge
              colorScheme="brand"
              px={3}
              py={1}
              rounded="full"
              fontWeight="bold"
            >
              {category}
            </Badge>
            <HStack>
              {Array(5)
                .fill(0)
                .map((_, i) => {
                  return (
                    <Star
                      key={i}
                      size={20}
                      color={i < Math.round(rating) ? primary : "#CBD5E0"}
                      fill={i < Math.round(rating) ? primary : "none"}
                    />
                  );
                })}
              <Text fontWeight="bold" color="text" ml={2}>
                {rating.toFixed(1)}
              </Text>
            </HStack>
            <Text fontSize="md" color={"gray.500"}>
              ${(price * 0.9).toFixed(2)}{" "}
              <Text
                as="span"
                fontSize="lg"
                color="muted"
                ml={2}
                textDecoration="line-through"
              >
                ${price.toFixed(2)}
              </Text>
            </Text>
            <Text color="text" color="gray.500">
              {description}
            </Text>
            {/* stock badge */}
            <Badge
              colorScheme="blue"
              px={3}
              py={1}
              rounded="md"
              fontWeight="bold"
            >
              {stock > 0 ? `In Stock: ${stock}` : "Out of Stock"}
            </Badge>
            <Text fontSize="2xl" fontWeight="bold" color={"blue.200"}>
              ${price}
            </Text>
            {/* Quantity + Add to Cart */}
            <HStack spacing={4}>
              <NumberInput
                value={quantity}
                onChange={(value) => setQuantity(Number(value))}
                min={1}
                max={stock || 100}
                size="md"
                isDisabled={stock === 0}
                rounded={"full"}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <Button
                leftIcon={<ShoppingCart />}
                isDisabled={stock === 0}
                onClick={addToCartHandler}
                bg={primary}
                color={"white"}
                _hover={{
                  bg: "brand.600",
                }}
              >
                Add to Cart
              </Button>
            </HStack>
          </VStack>
        </GridItem>
      </Grid>
    </VStack>
  );
};

export default ProductDetail;
