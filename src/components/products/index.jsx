"use client";
import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import localFont from "next/font/local";
import { Carattere, Lora } from "next/font/google";
import { Playfair } from "next/font/google";
import Image from "next/image.js";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import dynamic from "next/dynamic";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import basket from "../../app/images/basket.png";
import "./products.css";
import Loading from "../loaders";
import Ab from "../ab";
import added from "../../app/images/added.svg";

// import Sale from '../components/sale';
// import Item from '../components/item';
// import Cart from  '../components/header';
// import About from  '../components/about';
import Spiner from "../spiner";
// const Header = dynamic(()=>import('./components/Header'),{ssr:false})

const noir = localFont({
  src: [
    {
      path: "../../app/fonts/NoirPro-Light.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../app/fonts/NoirPro-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../app/fonts/NoirPro-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
});

const grape = localFont({
  src: [
    {
      path: "../../app/fonts/GrapeNuts-Regular.ttf",
      weight: "200",
      style: "normal",
    },
  ],
});

const arrows = localFont({
  src: [
    {
      path: "../../app/fonts/Pwnewarrows-mjrV.ttf",
      weight: "200",
      style: "normal",
    },
  ],
});

// const noir_b = localFont({ src: './fonts/NoirPro-Bold.ttf' });
// const noir = localFont({ src: './fonts/NoirPro-Regular.ttf' });
// const noir_l = localFont({ src: './fonts/NoirPro-Light.ttf' });
const lora = Lora({
  weight: ["700"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

const play = Playfair({
  weight: ["500"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

const Products = ({ cartData }) => {
  const [availableStores, setAvailableStores] = useState([]); //тут весь список магазинов
  const [selectedStore, setSelectedStore] = useState(null); //выбранный магазин из списка
  const [locations, setLocations] = useState([]); //массив из всех локаций выбранного магазина
  const [selectedLocation, setSelectedLocation] = useState(null); //выбранная локация магазина
  const [searchText, setSearchText] = useState(null); //то,что вбивается в поиск
  const [selectedLocationValue, setSelectedLocationValue] = useState(null); // номер магазина
  const [selectedLocationsObject, setSelectedLocationsObject] = useState(null); // {'Maxi Gatineau':8388,'Maxi Buckingham':8389,'Maxi Maniwaki':8624}
  const [responseData, setResponseData] = useState([]); //ответ с бэка
  const [selectedStores, setSelectedStores] = useState([]); //весь список магазинов
  const [selectedStoresID, setSelectedStoresID] = useState([]);
  const [selectedAll, setSelectedAll] = useState([]);
  const [cart, setCart] = useState([]);
  const [items, setItems] = useState([]);
  const [cartTrigger, setCartTrigger] = useState({});
  const [hideNonMatching, setHideNonMatching] = useState(false);
  const [error, setError] = useState();
  const [isAnimating, setIsAnimating] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [firstTime, setFirstTime] = useState(true);
  const [selectedSel, setSelectedSel] = useState([]);
  const buttonRef = useRef(null);
  const [addedToCart, setAddedToCart] = useState(
    Array(responseData.length).fill(false)
  );
  const [addedToCartImage, setAddedToCartImage] = useState(
    Array(responseData.length).fill(false)
  );
  const [state, setState] = useState({
    isPaneOpen: false,
    isPaneOpenLeft: false,
  });

  function toggle() {
    setIsOpen((isOpen) => !isOpen);
  }
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Предотвращает действие по умолчанию
      buttonRef.current.click(); // Имитирует нажатие кнопки
    }
  };
  // useEffect(() => {
  //   window.addEventListener("storage", () => {
  //     const storedStores = localStorage.getItem("temp");

  //     // Parse the stored state if it exists
  //     if (storedStores) {
  //       const parsedStores = JSON.parse(storedStores);

  //       // Update component state with parsed stored state
  //       setCart(parsedStores);
  //       // Similarly, update other state variables as needed
  //     }
  //   });
  // }, []);

  React.useEffect(() => {
    window.addEventListener("storage", () => {
      const selectedStore = JSON.parse(localStorage.getItem("selectedStore"));
      const selectedLocation = JSON.parse(
        localStorage.getItem("selectedLocation")
      );
      const store1 = JSON.parse(localStorage.getItem("store1"));
      const selectedAll = JSON.parse(localStorage.getItem("selectedAll"));
      //const responseData1 = JSON.parse(localStorage.getItem("responseData1"));
      console.log(selectedStore);
      setSelectedLocation(selectedLocation);
      setSelectedStore(selectedStore);
      setSelectedStoresID(store1);
      //setResponseData(responseData);
    });
  }, [selectedLocation, selectedStore, selectedAll, selectedStoresID]);

  console.log("mimimi", selectedAll);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.clear();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    axios
      .get("localhost:8080/api/stores")
      .then((response) => {
        setAvailableStores(response.data);
      })
      .catch((error) => {
        setError("Error fetching available stores");
        console.error("Error fetching available stores:", error);
      });
  }, []); // получаем список магазинов

  const handleStoreChange = async (selectedStore) => {
    setSelectedStore(selectedStore); // сюда кладем выбранный из списка магазин (из массива выбираем один из)
    localStorage.setItem("selectedStore", JSON.stringify(selectedStore));
    console.log(selectedStore);
    const store = JSON.parse(localStorage.getItem("selectedStore"));
    console.log(store);
    try {
      const response = await axios.get(
        `localhost:8080/api/stores/${selectedStore}`
      );

      if (response.status === 200) {
        const locationsObject = response.data.locations; // сюда приходят все локации выбранного магазина в формате Maxi Lon:3456
        const locationsArray = Object.keys(locationsObject); // сюда берутся только имена магазинов (ключи)
        setLocations(locationsArray); // сюда кладутся все локации выбранного магазина
        setSelectedLocationsObject(locationsObject); // сюда кладутся пришедшие с бека данные вида {'Maxi Gatineau':8388,'Maxi Buckingham':8389,'Maxi Maniwaki':8624}}
        // console.log(selectedLocationsObject);
      } else {
        setError(
          `Error fetching locations. Server returned: ${response.status}`
        );
        console.error(
          "Error fetching locations. Server returned:",
          response.status
        );
      }
    } catch (error) {
      setError(`Error fetching locations: ${error.message}`);
      console.error("Error fetching locations:", error.message);
    }
  };

  let getStores;

  const handleSearchChange = (event) => {
    // тут ищем продукт
    setSearchText(event.target.value);
    // getStores = localStorage.getItem("stores");
    // console.log(getStores);
  };

  const handleLocationChange = async (selectedLocation) => {
    // выбираем локацию из списка
    const newSelectedLocationValue = selectedLocationsObject[selectedLocation]; // извлекаем их объекта значение, связанное с ключом selectedLocation
    setSelectedLocationValue(newSelectedLocationValue); // тут теперь хранится value(цифра) выбранной локации
    setSelectedLocation(selectedLocation); // тут только имя локации
    localStorage.setItem("selectedLocation", JSON.stringify(selectedLocation));
  };

  //const getStoresFromLocalStorage = localStorage.getItem("stores") || [];

  const handleButtonClick = async () => {
    const selectedStoresID = JSON.parse(localStorage.getItem("stores1"));
    try {
      const response = await axios.post("localhost:8080/api/updateLocation", {
        selectedStoresID: selectedStoresID,
        searchText: searchText,
      });
      //console.log('Данные успешно отправлены на бэкенд', response.data)
      const responseData = response.data;
      console.log("Tyt data", responseData);
      setResponseData(responseData);
      setAddedToCartImage(Array(responseData.length).fill(false));

      // const getStorage = localStorage.getItem("stores") || [];
      // console.log(getStorage)
      // console.log(selectedStoresID); //тут нужные циферки

      // let id;
      // getStorage.forEach((item) => {
      //   id = item[item];
      // });

      // getStoresFromLocalStorage.push(id);

      //localStorage.setItem('stores', JSON.stringify(selectedStoresID));

      // const getStorage = localStorage.getItem("stores");
      // let storesArray;

      // if (getStorage) {
      //   storesArray = JSON.parse(getStorage); // Parse the retrieved value as JSON
      // } else {
      //   storesArray = []; // If no value is retrieved or it's not valid JSON, initialize storesArray as an empty array
      // }

      // console.log(getStorage);
      // console.log(selectedStoresID); // Assuming this is where you get your desired IDs

      // selectedStoresID.forEach((id) => {
      //   storesArray.push(id); // Push each selectedStoresID into storesArray
      // });
      // localStorage.setItem("stores", JSON.stringify(storesArray));
      const getStorage = localStorage.getItem("stores_1234");
      const getStorage1 = localStorage.getItem("stores1");
      let storesSet = new Set();
      let storesSet1 = new Set();

      if (getStorage) {
        storesSet = new Set(JSON.parse(getStorage)); // Parse the retrieved value as JSON and initialize storesSet as a Set
      }

      if (getStorage1) {
        storesSet1 = new Set(JSON.parse(getStorage1)); // Parse the retrieved value as JSON and initialize storesSet as a Set
      }

      console.log(getStorage);
      console.log(selectedStoresID);

      // Add selectedStoresID to the storesSet to ensure uniqueness
      selectedStoresID.forEach((id) => {
        storesSet.add(id);
      });

      selectedStoresID.forEach((id) => {
        storesSet1.add(id);
      });

      // Convert the storesSet back to an array before storing in localStorage
      const storesArray = Array.from(storesSet);
      const storesArray1 = Array.from(storesSet1);

      // Update "stores" key in localStorage with the updated storesArray
      localStorage.setItem("stores_1234", JSON.stringify(storesArray));
      localStorage.setItem("stores1", JSON.stringify(storesArray1));
      console.log("Here is the data", responseData);
      // setIsLoading(false);
    } catch (error) {
      console.error("Ошибка при отправке данных на бэкенд", error);
    }
  };

  const handleAddStore = () => {
    const existingStores = JSON.parse(localStorage.getItem("stores1"));
    if (!selectedStores.includes(selectedLocation)) {
      setSelectedStores([...selectedStores, selectedLocation]); // кладем выбранные локации в массив
      const newSelectedLocationValue =
        selectedLocationsObject[selectedLocation]; // извлекаем их объекта значение, связанное с ключом selectedLocation
      const newStoreLocationObject = {
        store: selectedStore,
        location: selectedLocation,
        id: newSelectedLocationValue,
      };

      const storesNames = JSON.parse(localStorage.getItem("storesName")) || [];
      if (
        !storesNames.some((store) => store.id === newStoreLocationObject.id)
      ) {
        storesNames.push(newStoreLocationObject);
        localStorage.setItem("storesName", JSON.stringify(storesNames));
      }

      setSelectedAll((prevSelectedAll) => [
        ...prevSelectedAll,
        newStoreLocationObject,
      ]);

      const selectedAll = JSON.parse(localStorage.getItem("selectedAll")) || [];
      if (!selectedAll.includes(newStoreLocationObject)) {
        storesNames.push(newStoreLocationObject);
        localStorage.setItem("selectedAll", JSON.stringify(selectedAll));
      }
      const storesNames1 = JSON.parse(localStorage.getItem("sel")) || [];
      if (!storesNames1.includes(newStoreLocationObject)) {
        storesNames1.push(newStoreLocationObject);
        localStorage.setItem("sel", JSON.stringify(storesNames1));
      }
      const names1 = JSON.parse(localStorage.getItem("stores1")) || [];
      if (!names1.includes(newStoreLocationObject.id)) {
        names1.push(newStoreLocationObject.id);
        localStorage.setItem("stores1", JSON.stringify(names1));
      }
      setSelectedSel(storesNames1);
      setSelectedStoresID(existingStores);
      console.log(selectedSel);
      setSelectedLocationValue(newSelectedLocationValue); // сюда кладем номер каждого магазина
      setSelectedStoresID([...selectedStoresID, newSelectedLocationValue]); // получаем массив из номеров магазинов
      setFirstTime(false);
      if (searchText && searchText.length > 0) {
        handleButtonClick();
      }
      //localStorage.setItem("stores1",JSON.stringify(selectedStoresID))
      // const existingStores = JSON.parse(localStorage.getItem("stores1")) || [];
      // if (!storesNames1.includes(newStoreLocationObject.id)) {
      //   localStorage.setItem("stores1", JSON.stringify(existingStores));
      // }
    }
  };

  // const lengthMatchesArray = responseData.map(
  //   (product) => selectedAll.length === product.products.length
  // );

  const handleAddToCart = async (product, index) => {
    const existingItems = JSON.parse(localStorage.getItem("cart")) || [];
    const title = JSON.parse(localStorage.getItem("names")) || [];

    console.log(existingItems);
    try {
      console.log(existingItems);
      const updatedCart = cart.map((shop) => ({ ...shop }));
      localStorage.setItem("temp", JSON.stringify(updatedCart));
      for (const item of product.products) {
        const storeIndex = updatedCart.findIndex(
          (store) => store.storeID === item.storeID
        );

        if (storeIndex === -1) {
          updatedCart.push({
            storeID: item.storeID,
            storeName: item.store,
            items: [
              {
                name: product.title,
                id: item.productID,
              },
            ],
          });
        } else {
          updatedCart[storeIndex].items.push({
            name: product.title,
            id: item.productID,
          });
        }
      }

      //const extractedIDs = new Set();
      //console.log(extractedIDs);

      //      let ids;

      // updatedCart.forEach((store) => {
      //   store.items.forEach((item) => {
      //     ids = item.id;
      //     console.log(ids); // This will log each ID separately
      //     existingItems.push(ids); // This will add each ID to existingItems one by one
      //   });
      // });

      // updatedCart[0].items.forEach((item) => {
      //   let ids = item.id;
      //   console.log(ids); // This will log each ID separately
      //   existingItems.push(ids); // This will add each ID to existingItems one by one
      // });
      let id;
      let name;
      updatedCart[0].items.forEach((item) => {
        id = item.id;
      });
      existingItems.push(id);

      updatedCart[0].items.forEach((item) => {
        name = item.name;
      });
      title.push(name);

      console.log("names", title);
      console.log("existing", existingItems);

      localStorage.setItem("cart", JSON.stringify(existingItems));
      localStorage.setItem("names", JSON.stringify(title));

      const updatedAddedToCart = [...addedToCart];
      updatedAddedToCart[index] = true;
      setAddedToCart(updatedAddedToCart);
      const updatedAddedToCartImage = [...addedToCartImage];
      updatedAddedToCartImage[index] = true;
      setAddedToCartImage(updatedAddedToCartImage);

      setTimeout(() => {
        const resetAddedToCart = [...updatedAddedToCart];
        resetAddedToCart[index] = false;
        setAddedToCart(resetAddedToCart);
      }, 1000);
      // console.log(ids)
      // existingItems.push(ids)

      // const uniqueIDs = Array.from(extractedIDs);
      if (!localStorage.getItem("temp")) {
        localStorage.setItem("temp", JSON.stringify(updatedCart));
      }

      setCart(updatedCart); // Update the cart state with the data from the temp storage
      setItems(id);
      if (!existingItems.includes(id)) {
        // Add the item code to the existing array of items
        // existingItems.push(uniqueIDs);
        // Save the updated array back to localStorage
        localStorage.setItem("cart", JSON.stringify(existingItems));
        window.dispatchEvent(new Event("storage"));
      } else {
        console.log("Item already exists in the cart.");
      }
      //existingItems.push(uniqueIDs);
      // console.log(uniqueIDs);
      if (!title.includes(name)) {
        //existingItems.push(uniqueIDs);
        localStorage.setItem("names", JSON.stringify(title));
        window.dispatchEvent(new Event("storage"));
      }

      if (!title.includes(name)) {
        // Add the item code to the existing array of items
        // existingItems.push(uniqueIDs);
        // Save the updated array back to localStorage
        localStorage.setItem("names", JSON.stringify(title));
        window.dispatchEvent(new Event("storage"));
      } else {
        console.log("Item already exists in the cart.");
      }
      //existingItems.push(uniqueIDs);
      // console.log(uniqueIDs);
      if (!title.includes(name)) {
        //existingItems.push(uniqueIDs);
        localStorage.setItem("names", JSON.stringify(title));
        window.dispatchEvent(new Event("storage"));
      }

      setCart(updatedCart);
      // setItems(uniqueIDs);
      // const mim = JSON.parse(localStorage.getItem("temp"))
      // console.log(mim)
      // setCart(mim)
      window.dispatchEvent(new Event("storage"));
      const existingTempData = JSON.parse(localStorage.getItem("temp"));
      console.log(existingTempData);
      if (existingTempData !== null && existingTempData !== undefined) {
        localStorage.setItem("temp", JSON.stringify(cart));
        console.log(cart);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Handle errors appropriately
    }
  }; // works

  // console.log(uniqueIDs);
  // if (!existingItems.includes(uniqueIDs)) {
  //   //existingItems.push(uniqueIDs);

  // const clearData = () => {
  //   const zeroPriceIndexes = [];

  //   cart.forEach((store) => {
  //     store.items.forEach((item, itemIndex) => {
  //       if (item.price === 0) {
  //         zeroPriceIndexes.push(itemIndex);
  //       }
  //     });
  //   });
  //   console.log(zeroPriceIndexes);
  //   console.log(cart.length);
  // };

  // clearData();

  // const saveCartData = (items) => {
  //   localStorage.setItem('cart', JSON.stringify(items));
  //   window.dispatchEvent(new Event("storage"))
  // };

  // const loadCartData = () => {
  //   const savedCart = localStorage.getItem('cart');
  //   if (savedCart) {
  //     setCart(JSON.parse(savedCart));
  //     console.log(cart);
  //   }
  // };
  console.log("cart", cart);
  console.log(cartData);

  // async function getItemPriceForStore(productId, storeId) {
  //   if (productId == null) {
  //     const pr = 0;
  //     return pr;
  //   } else {
  //     const response = await axios.get(
  //       `https://grocerytracker.ca/api/pc/search/${storeId}/${productId}`
  //     );
  //     const price = response.data;
  //     console.log(price);
  //     //const value = price.filter((item) => storeId == item.storeID);
  //     //const pr = value[0].prices[value[0].prices.length - 1].price;
  //     const pr = price.results[0].prices.price;
  //     return pr;
  //   }
  // }

  //   useEffect(() => {
  //   window.addEventListener("storage", () => {
  //     const storedStores = localStorage.getItem("temp");

  //     // Parse the stored state if it exists
  //     if (storedStores) {
  //       const parsedStores = JSON.parse(storedStores);

  //       // Update component state with parsed stored state
  //       setCart(parsedStores);
  //       // Similarly, update other state variables as needed
  //     }
  //   });
  // }, []);

  console.log("selectedAll", selectedAll);
  console.log(selectedStoresID);
  console.log(selectedStoresID);
  //   const removeStore = (storeId) => {
  //     // Filter out the store with the given ID from the data array
  //     const updatedData = selectedAll.filter((store) => store.id !== storeId);
  //     // Update the data array with the filtered data
  //     //setSelectedStoresID(updatedData);
  //     setSelectedAll(updatedData);
  //     console.log(updatedData);

  // //     const up = responseData.map((item) =>
  // //     item.products.filter((product) => product.storeID !== storeId)
  // // );
  // //     console.log(up);

  //     //console.log("Filtered Local Storage Data:", filteredLocalStorageData);

  //     const get = JSON.parse(localStorage.getItem("stores"));
  //     if (get) {
  //       console.log(get);
  //       const da = get.filter((store) => store !== storeId);
  //       console.log(da);
  //       //selectedStoresID(da)
  //       localStorage.setItem("stores", JSON.stringify(da));
  //     }

  //     function removeProductByID(data, productID) {
  //       return data.products.filter(product => product.productID !== productID);
  //   }

  //   // Assign the modified products array to a new variable
  //   let newData = {
  //       ...data,
  //       products: removeProductByID(responseData, storeId)
  //   };

  //   };

  // const removeStore = (storeId) => {
  //   // Filter out the store with the given ID from the data array
  //   const updatedData = selectedAll.filter((store) => store.id !== storeId);
  //   const stores = JSON.parse(localStorage.getItem("stores1"));
  //   setSelectedAll(updatedData);

  //   console.log("updatedData",updatedData)
  //   console.log("selectedStoresID",selectedStoresID)

  //   const updatedStoresID = stores.filter(
  //     (store) => store !== storeId
  //   );

  //   console.log("updated",updatedStoresID)
  //   setSelectedStoresID(updatedStoresID)
  //   // Update local storage
  //   const localStorageData = JSON.parse(localStorage.getItem("stores"));
  //   const all = JSON.parse(localStorage.getItem("sel"));
  //   const names = JSON.parse(localStorage.getItem("storesName"));

  //   if (localStorageData) {
  //     const updatedLocalStorageData = localStorageData.filter(
  //       (store) => store !== storeId
  //     );
  //     localStorage.setItem("stores", JSON.stringify(updatedLocalStorageData));
  //   }

  //   if (stores) {
  //     const updatedLocalStorageData = stores.filter(
  //       (store) => store !== storeId
  //     );
  //     localStorage.setItem("stores1", JSON.stringify(updatedLocalStorageData));
  //     setSelectedStoresID(updatedLocalStorageData)
  //   }

  //   if (all) {
  //     const updatedLocalStorageData = all.filter(
  //       (store) => store.id !== storeId
  //     );
  //     localStorage.setItem("sel", JSON.stringify(updatedLocalStorageData));
  //   }
  //   if (names) {
  //     const updatedLocalStorageData = all.filter(
  //       (store) => store.id !== storeId
  //     );
  //     localStorage.setItem("storesName", JSON.stringify(updatedLocalStorageData));
  //   }

  //   // Remove associated products
  //   const updatedResponseData = responseData.map((item) => ({
  //     ...item,
  //     products: removeProductByID(item.products, storeId),
  //   }));

  //   console.log(updatedstoresResponseData);

  //   function removeProductByID(products, storeId) {
  //     return products.filter((product) => product.storeID.toString() !== storeId.toString());
  //   }

  //   handleButtonClick();

  // };  //тут удаление было
  console.log(selectedSel);

  const removeStore = (storeId) => {
    const data = JSON.parse(localStorage.getItem("stores1"));
    console.log(data);
    const updatedData = JSON.parse(localStorage.getItem("sel"));
    const updatedData3 = JSON.parse(localStorage.getItem("storesName"));
    // Filter out the store with the given ID from the data array
    const updatedData1 = updatedData.filter((store) => store.id != storeId);
    const updatedData4 = updatedData3.filter((store) => store.id != storeId);
    localStorage.setItem("sel", JSON.stringify(updatedData1));
    localStorage.setItem("storesName", JSON.stringify(updatedData4));
    setSelectedAll(updatedData1);
    const da = data.filter((store) => store != storeId);
    console.log("da", da);
    const updatedData2 = JSON.parse(localStorage.getItem("stores_1234"));
    let stores;
    if (updatedData2) {
      stores = updatedData2.filter((store) => store != storeId);
    }
    console.log("da", da);
    // if (updatedData.length < 1) {
    //   localStorage.removeItem("cart");
    //   localStorage.removeItem("names");
    // }
    localStorage.setItem("stores1", JSON.stringify(da));

    localStorage.setItem("stores_1234", JSON.stringify(stores));
    setSelectedStores(selectedAll.map((item) => item.location));
    console.log(selectedStores);
    setSelectedStoresID(da);
    setSelectedStores(selectedAll);
    handleButtonClick();
  };

  React.useEffect(() => {
    window.addEventListener("storage", () => {
      const selectedStore = JSON.parse(localStorage.getItem("selectedStore"));
      const selectedLocation = JSON.parse(
        localStorage.getItem("selectedLocation")
      );
      const selectedAll = JSON.parse(localStorage.getItem("sel"));
      const stores1 = JSON.parse(localStorage.getItem("stores1"));
      console.log("lalala", selectedLocation);
      console.log("lalalalalal", selectedStore);
      console.log("lalala", selectedAll);
      console.log("stores_1234", stores1);
    });
  }, [selectedLocation, selectedStore, selectedAll]);

  useEffect(() => {
    // Function to handle changes in localStorage
    const handleStorageChange = () => {
      const sale = JSON.parse(localStorage.getItem("selectedStore"));
      const selectedAll = JSON.parse(localStorage.getItem("sel"));
      const storedResponseData = JSON.parse(
        localStorage.getItem("selectedLocation")
      );
      const stores1 = JSON.parse(localStorage.getItem("stores1"));
      // const stores1 = JSON.parse(
      //   localStorage.getItem("stores1")
      // );
      const cartNames = JSON.parse(localStorage.getItem("selectedAll"));
      if (cartNames) {
        setSelectedAll(cartNames);
      }
      if (sale) {
        setSelectedStore(sale);
        handleStoreChange(sale);
      }
      if (storedResponseData) {
        setSelectedLocation(storedResponseData);
      }
      if (selectedAll) {
        setSelectedAll(selectedAll);
      }
      // if (stores1) {
      //   setSelectedStoresID(stores1);
      // }
    };

    // Initial setup from localStorage
    handleStorageChange();

    // Listen for changes in localStorage
    window.addEventListener("storage", handleStorageChange);

    // Cleanup function
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div>
      <div style={{ marginLeft: "80px", marginRight: "80px" }}>
        <h1
          style={{
            textAlign: "center",
            paddingBottom: "0px",
            marginBottom: "0px",
          }}
          className={noir.className}
        >
          Compare Prices
        </h1>
        <p
          style={{
            textAlign: "center",
            paddingTop: "0px",
            marginTop: "0px",
            paddingBottom: "18px",
          }}
          className={noir.className}
        >
          Select the stores you'd like to compare prices for various products
        </p>
        <div>
          <label
            style={{
              paddingRight: "8px",
              fontSize: "18px",
            }}
            className={noir.className}
          >
            Select Store:
          </label>
          <select
            className={noir.className}
            style={{
              width: "210px",
              height: "38px",
              padding: "0.375rem 2.25rem 0.375rem 0.75rem",
              fontSize: "1rem",
              fontWeight: "400",
              lineHeight: "1.5",
              color: "#212529",
              backgroundColor: "#fff",
              border: "1px solid #ced4da",
              borderRadius: "0.25rem",
              transition:
                "border-color .15s ease-in-out,box-shadow .15s ease-in-out",
            }}
            onChange={(e) => handleStoreChange(e.target.value)}
            value={selectedStore}
          >
            <option className={noir.className} value="">
              Select...
            </option>
            {availableStores.map((store) => (
              <option className={noir.className} key={store} value={store}>
                {store}
              </option>
            ))}
          </select>
          {selectedStore && (
            <>
              <label
                style={{
                  paddingRight: "8px",
                  fontSize: "18px",
                  paddingLeft: "24px",
                }}
                className={noir.className}
              >
                Select Location:
              </label>
              <select
                className={noir.className}
                style={{
                  height: "38px",
                  marginRight: "16px",
                  maxWidth: "320px",
                  padding: "0.375rem 0.25rem 0.375rem 0.75rem",
                  fontSize: "1rem",
                  fontWeight: "400",
                  lineHeight: "1.5",
                  color: "#212529",
                  backgroundColor: "#fff",
                  border: "1px solid #ced4da",
                  borderRadius: "0.25rem",
                  transition:
                    "border-color .15s ease-in-out,box-shadow .15s ease-in-out",
                }}
                onChange={(e) => handleLocationChange(e.target.value)}
                value={selectedLocation}
              >
                <option value="">Select...</option>
                {locations.map((location, index) => (
                  <option
                    className={noir.className}
                    key={index}
                    value={location}
                  >
                    {location}
                  </option>
                ))}
              </select>
            </>
          )}

          {selectedLocation && (
            <button
              style={{
                outline: "0",
                cursor: "pointer",
                height: "38px",
                marginRight: "24px",
                padding: "5px 16px",
                fontSize: "14px",
                fontWeight: "500",
                lineHeight: "20px",
                verticalAlign: "middle",
                border: "1px solid",
                borderRadius: " 6px",
                color: " #24292e",
                backgroundColor: "#fafbfc",
                borderColor: "#1b1f2326",
                boxShadow:
                  "rgba(27, 31, 35, 0.04) 0px 1px 0px 0px, rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset",
                transition: "0.2s cubic-bezier(0.3, 0, 0.5, 1)",
              }}
              disabled={selectedLocation === null}
              className={noir.className}
              onClick={handleAddStore}
            >
              Add Store
            </button>
          )}
          {selectedAll.length > 0 && (
            <div onKeyDown={handleKeyDown} tabIndex="0">
              <label
                style={{ paddingRight: "8px", fontSize: "18px" }}
                className={noir.className}
              >
                Search:
              </label>
              <input
                className={noir.className}
                placeholder="Search for..."
                style={{
                  padding: "0.375rem 2.25rem 0.375rem 0.75rem",
                  fontSize: "1rem",
                  marginRight: "16px",
                  fontWeight: "400",
                  lineHeight: "1.5",
                  color: "#212529",
                  backgroundColor: "#fff",
                  border: "1px solid #ced4da",
                  borderRadius: "0.25rem",
                  transition:
                    "border-color .15s ease-in-out,box-shadow .15s ease-in-out",
                  width: "120px",
                }}
                type="text"
                value={searchText}
                onChange={handleSearchChange}
                required
              />

              <button
                className={noir.className}
                style={{
                  outline: "0",
                  height: "38px",
                  cursor: "pointer",
                  padding: "5px 16px",
                  fontSize: "14px",
                  fontWeight: "500",
                  lineHeight: "20px",
                  verticalAlign: "middle",
                  border: "1px solid",
                  borderRadius: " 6px",
                  color: " #24292e",
                  backgroundColor: "#fafbfc",
                  borderColor: "#1b1f2326",
                  boxShadow:
                    "rgba(27, 31, 35, 0.04) 0px 1px 0px 0px, rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset",
                  transition: "0.2s cubic-bezier(0.3, 0, 0.5, 1)",
                }}
                //disabled={searchText === null || selectedLocation === null}
                onClick={handleButtonClick}
                ref={buttonRef}
                disabled={!searchText || !selectedLocation}
              >
                Search
              </button>
            </div>
          )}
        </div>
        {firstTime && selectedAll.length === 0 ? (
          <Ab />
        ) : (
          <>
            <div>
              {searchText &&
                searchText.length > 0 &&
                selectedAll.length > 0 &&
                responseData.length > 0 &&
                responseData && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      marginRight: "60px",
                    }}
                  ></div>
                )}
              {selectedAll.length > 0 && (
                <>
                  {" "}
                  <h3 className={noir.className}>Selected Stores:</h3>
                  <ul value={selectedAll}>
                    {selectedAll.map((store, index) => (
                      <li className={noir.className} key={index}>
                        {store.store} : {store.location}
                        <button
                          style={{
                            outline: "0px",
                            // marginLeft: "20px"
                            fontSize: "15px",
                            fontWeight: "500",
                            lineHeight: "20px",
                            verticalAlign: "middle",
                            color: "red",
                            border: "0px",
                            cursor: "pointer",
                            backgroundColor: "transparent",
                          }}
                          className={noir.className}
                          onClick={() => removeStore(store.id)}
                          title="Delete Store"
                        >
                          X
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "stretch",
              }}
            >
              {responseData.map((item, index) => (
                <div
                  style={{
                    width: "480px",
                    boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginRight: "20px",
                    flexShrink: "0",
                    marginBottom: "20px",
                  }}
                  key={index}
                >
                  <div>
                    <p
                      className={noir.className}
                      style={{
                        fontSize: "20px",
                        maxWidth: "350px",
                        paddingTop: "20px",
                        height: "56px",
                      }}
                    >
                      {item.title}
                    </p>
                    {/* <p>{item.brand}</p> */}
                  </div>
                  <>
                    <div style={{ height: "35px" }}>
                      {addedToCartImage[index] ? (
                        <Image
                          style={{ paddingLeft: "90px" }}
                          width={35}
                          height={35}
                          src={added}
                        />
                      ) : (
                        " "
                      )}
                    </div>
                    <Zoom>
                      <img
                        style={{
                          width: "120px",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        src={item.photo}
                        alt={`Photo of ${item.title}`}
                      />
                    </Zoom>
                  </>
                  <div
                    className={noir.className}
                    style={{
                      marginBottom: "20px",
                      fontWeight: "normal",
                      color: "grey",
                      fontSize: "14px",
                    }}
                  >
                    {item.products[0].weight == ""
                      ? "$" +
                        (item.products[0].prices.unitPriceValue * 10).toFixed(
                          2
                        ) +
                        " / 1" +
                        " " +
                        "kg"
                      : item.products[0].weight}
                  </div>
                  <button
                    className={`${noir.className} box`}
                    style={{
                      outline: "0",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      lineHeight: "20px",
                      verticalAlign: "middle",
                      border: "1px solid",
                      borderRadius: " 6px",
                      color: " #24292e",
                      backgroundColor: "#fafbfc",
                      borderColor: "#1b1f2326",
                      transition: "0.2s cubic-bezier(0.3, 0, 0.5, 1)",
                    }}
                    onClick={() => handleAddToCart(item, index)}
                  >
                    {addedToCart[index] ? (
                      <p style={{ color: "green", padding: " 0px 19px" }}>
                        Added to cart
                      </p>
                    ) : (
                      <p style={{ color: "black", padding: " 0px 19px" }}>
                        Add to Cart
                      </p>
                    )}
                  </button>
                  <div
                    style={{
                      display: "flex",
                      paddingBottom: "20px",
                      marginTop: "30px",
                    }}
                  >
                    <div style={{ paddingRight: "20px", flexDirection: "row" }}>
                      {item.products.map((store, index) => (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                          key={index}
                        >
                          <p
                            className={noir.className}
                            style={{ paddingRight: "12px", maxWidth: "250px" }}
                            key={index}
                          >
                            {store.store}
                          </p>
                          {store.saleprice !== null ? (
                            <p
                              className={noir.className}
                              style={{ fontWeight: "700", color: "red" }}
                            >
                              {store.saleprice}
                            </p>
                          ) : (
                            <p
                              className={noir.className}
                              style={{ fontWeight: "700" }}
                            >
                              {store.regprice}
                            </p>
                          )}
                          {store.wasPrice && (
                            <s
                              style={{
                                marginRight: "10px",
                                marginBottom: "5px",
                              }}
                            >
                              ({store.wasPrice})
                            </s>
                          )}
                          {store.stock}
                          {store.points}
                          {store.sale}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {cart.length !== 0 && (
        <div
          style={{
            position: "sticky",
            rigth: "50",
            bottom: "0",
            float: "right",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              //position: 'sticky',
              height: "40px",
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
            }}
          ></div>
        </div>
      )}
      <SlidingPane
        className={noir.className}
        overlayClassName={noir.className}
        isOpen={state.isPaneOpen}
        title="Cart"
        onRequestClose={() => {
          setState({ isPaneOpen: false });
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            opacity: "100",
            transition: "all .75s ease",
          }}
        >
          Lalalalalallalalal
          {/* {cart.map((store, storeIndex) => (
            <div style={{ marginRight: "32px" }} key={storeIndex}>
              <h3>{store.storeName}</h3>
              <ol>
                {store.items.map((item, itemIndex) => (
                  <>
                    <li key={itemIndex}>
                      {item.name + " " + "$" + item.price}
                    </li>
                  </>
                ))}
              </ol>
              <p>
                <b>Total price:</b> {parseFloat(store.sum.toFixed(2))}
              </p>
            </div>
          ))} */}
        </div>
      </SlidingPane>
    </div>
  );
};

export default Products;
