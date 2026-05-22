import React, { useEffect } from "react";
import { useGetProductList } from "../services/products/index";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  useColorModeValue,
  Card,
  CardBody,
  CardFooter,
  Badge,
  Stack,
  Button,
  Image,
  IconButton,
  Center,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";
import { dark } from "../constants";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Product = () => {
  const [swiperInstance, setSwiperInstance] = React.useState(null);
  const prevRef = React.useRef(null);
  const nextRef = React.useRef(null);

  const navBg = useColorModeValue("black", "white");
  const navColor = useColorModeValue("white", "black");
  const cardBg = useColorModeValue("white", dark);

  // assign refs to swiper navigation after component mounts
  useEffect(() => {
    if (swiperInstance && prevRef.current && nextRef.current) {
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance]);

  const [search, setSearch] = React.useState("");
  const [sortBy, setSortBy] = React.useState("price");
  const [order, setOrder] = React.useState("asc");
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);

  const { data, isLoading, error, isError } = useGetProductList(
    search,
    sortBy,
    order,
    limit,
    page,
  );
  console.log("🚀 ~ Product ~ data:", data);
  return (
    <>
      {isLoading && (
        <Center py={20}>
          <Spinner size="xl" color="brand.400" />
        </Center>
      )}
      {isError && (
        <Center py={20}>
          <Text color={"red.500"}>Failed to load products</Text>
        </Center>
      )}
      {/* for empty state */}
      {!isLoading && !isError && data?.products?.length === 0 && (
        <Center py={20}>
          <Text color={"gray.500"}>No products found</Text>
        </Center>
      )}
      {/* Product cards */}
      {!isLoading && !isError && data?.products?.length > 0 && (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {data.products.map((product) => (
            <Card
              key={product.id}
              maxWidth="sm"
              bg={cardBg}
              borderRadius="2xl"
              boxShadow="0 8px 20px rgba(112, 129, 129, 0.25)"
              border="2px solid transparent"
              role="group"
            >
              <CardBody>
                {/* Discount coupon badge */}
                <HStack>
                  <Badge
                    position="absolute"
                    top={2}
                    left={2}
                    colorScheme="brand"
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontSize="9px"
                    shadow="md"
                  >
                    {product.category}
                  </Badge>
                  <Badge
                    position="absolute"
                    top={2}
                    right={2}
                    colorScheme="blue"
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontSize="9px"
                    shadow="md"
                  >
                    10% Off
                  </Badge>
                </HStack>
                <Box
                  overflow="hidden"
                  borderRadius="lg"
                  transition="transform 0.4s ease"
                >
                  <Image
                    src={product?.images?.[0]}
                    alt={product.title}
                    w="100%"
                    h="200px"
                    objectFit="cover"
                  />
                </Box>
                <Stack spacing={2} mt={4}>
                  <Heading size={{ base: "sm", "2xl": "md" }} color={"primary"}>
                    {product.title}
                  </Heading>
                  <Text noOfLines={2} color="muted" fontSize="sm">
                    {product.description}
                  </Text>

                  {/* price section */}
                  <HStack mt={2} spacing={3} align="center">
                    <Badge
                      colorScheme="blue" // or "brand"
                      borderRadius="full"
                      px={4}
                      py={2}
                      width="fit-content"
                      fontSize="md"
                      fontWeight="bold"
                    >
                      ${(product.price * 0.9).toFixed(2)}{" "}
                    </Badge>
                    {/* original price */}
                    <Text
                      fontSize="lg"
                      color="gray.500"
                      textDecoration="line-through"
                    >
                      ${product.price.toFixed(2)}
                    </Text>
                  </HStack>
                </Stack>
              </CardBody>
              <CardFooter>
                <Button
                  as={Link}
                  to={`/products/${product.id}`}
                  flex={1}
                  bg="primary"
                  color="white"
                  _hover={{ bg: "primary.900", boxShadow: "md" }}
                  rounded={"full"}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </>
  );
};

export default Product;
