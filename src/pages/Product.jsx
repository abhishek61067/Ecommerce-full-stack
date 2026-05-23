import { CiSearch } from "react-icons/ci";
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
  InputGroup,
  InputLeftElement,
  Input,
  Select,
} from "@chakra-ui/react";
import { dark } from "../constants";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Tilt from "react-parallax-tilt";

const getPageNumbers = (current, total) => {
  const delta = 1; // pages around current page
  const range = [];
  const left = Math.max(1, current - delta);
  const right = Math.min(total, current + delta);

  // Add pages from 1 to left
  for (let i = 1; i < left; i++) {
    if (i <= 2 || i > total - 2 || (i >= left && i <= right)) {
      range.push(i);
    } else if (range[range.length - 1] !== "...") {
      range.push("...");
    }
  }

  // Add pages from left to right (around current page)
  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  // Add pages from right to total
  for (let i = right + 1; i <= total; i++) {
    if (i > total - 2) {
      range.push(i);
    } else if (range[range.length - 1] !== "...") {
      range.push("...");
    }
  }

  return range;
};

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

  // pagination state
  const [page, setPage] = React.useState(1);

  const [search, setSearch] = React.useState("");
  const [sortBy, setSortBy] = React.useState("price");
  const [order, setOrder] = React.useState("asc");
  const [limit, setLimit] = React.useState(10);

  const { data, isLoading, error, isError } = useGetProductList(
    search,
    sortBy,
    order,
    limit,
    page,
  );
  return (
    <Box py={8} px={6}>
      <HStack mb={8} justify="space-between">
        {/* left search */}
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <CiSearch size={18} color="gray" />
          </InputLeftElement>
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            borderRadius="full"
            bg={useColorModeValue("white", "gray.700")}
            shadow="sm"
            transition="all 0.3s ease" // ✅ smooth animation
            w={{ base: "200px", md: "300px" }} // default width
            _focus={{
              borderColor: "pink.400",
              boxShadow: "0 8px 30px rgba(255, 84, 152, 0.4)",
              w: { base: "250px", md: "500px" }, // ✅ expand on focus
            }}
          />{" "}
        </InputGroup>
        {/* right sorting */}
        {/* Right: Sorting */}
        <Select
          maxW="200px"
          value={`${sortBy}-${order}`}
          onChange={(e) => {
            const [newSort, newOrder] = e.target.value.split("-");
            setSortBy(newSort);
            setOrder(newOrder);
          }}
          color="text"
          bg={useColorModeValue("white", "gray.700")}
          rounded="full"
          transition="all 0.3s ease"
          _focus={{
            borderColor: "pink.400",
            boxShadow: "0 15px 30px rgba(255, 84, 152, 0.4)", // pink glow
            outline: "none",
          }}
        >
          <option value="title-asc">Title - A - Z</option>
          <option value="title-desc">Title - Z - A</option>
          <option value="price-asc">Price - Low - High</option>
          <option value="price-desc">Price - High - Low</option>
        </Select>
      </HStack>
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
            <Tilt
              glareEnable={true}
              glareMaxOpacity={0.0}
              scale={1.1}
              transitionSpeed={2500}
              tiltMaxAngleX={25}
              tiltMaxAngleY={25}
              className="w-[300px]"
            >
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
                    <Heading
                      size={{ base: "sm", "2xl": "md" }}
                      color={"primary"}
                    >
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
            </Tilt>
          ))}
        </SimpleGrid>
      )}
      {/* pagination buttons */}
      {data && data.total && (
        <HStack spacing={2} justify="center" mt={8} wrap={"wrap"}>
          {/* previous button */}
          <Button
            size={{ base: "xs", md: "sm" }}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            isDisabled={page === 1}
            colorScheme="brand"
          >
            Previous
          </Button>

          {/* rest of the buttons in middle */}
          {getPageNumbers(page, Math.ceil(data.total / limit)).map((p, i) =>
            p === "..." ? (
              <Text key={i} px={2}>
                ...
              </Text>
            ) : (
              <Button
                key={i}
                bg={
                  p === page
                    ? "brand.300"
                    : useColorModeValue("gray.200", "gray.700")
                }
                onClick={() => setPage(p)}
                size={{ base: "xs", md: "sm" }}
              >
                {p}
              </Button>
            ),
          )}

          {/* next button */}
          <Button
            size={{ base: "xs", md: "sm" }}
            onClick={() => setPage((prev) => prev + 1)}
            isDisabled={page === Math.ceil(data.total / limit)}
            colorScheme="brand"
          >
            Next
          </Button>
        </HStack>
      )}
    </Box>
  );
};

export default Product;
