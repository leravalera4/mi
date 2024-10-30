'use client';
import React, { Component, useState, useEffect } from 'react';
import axios from 'axios';
import localFont from 'next/font/local';
import { Carattere, Lora } from 'next/font/google';
import { Playfair } from 'next/font/google';
import './DraggableSticky.css';
import Image from 'next/image.js';
import basket from './images/icon.png';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import './cart.css';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import dynamic from 'next/dynamic';
import Header from '../components/header';
import Sale from '../components/sale';
import Products from '../components/products';
import Item from '../components/item';
import Cart from  '../components/header';
import About from  '../components/about';
import Spiner from '../components/spiner'
// const Header = dynamic(()=>import('./components/Header'),{ssr:false})

const noir = localFont({
  src: [
    {
      path: './fonts/NoirPro-Light.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: './fonts/NoirPro-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/NoirPro-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
});

// const noir_b = localFont({ src: './fonts/NoirPro-Bold.ttf' });
// const noir = localFont({ src: './fonts/NoirPro-Regular.ttf' });
// const noir_l = localFont({ src: './fonts/NoirPro-Light.ttf' });
const lora = Lora({
  weight: ['700'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
});

const play = Playfair({
  weight: ['500'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
});

const StoreSelector = () => {
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
  const [cartTrigger, setCartTrigger] = useState({});
  const [hideNonMatching, setHideNonMatching] = useState(false);
  const [error, setError] = useState();
  const [isAnimating, setIsAnimating] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(
    Array(responseData.length).fill(false)
  );

  const [state, setState] = useState({
    isPaneOpen: false,
    isPaneOpenLeft: false,
  });

  function toggle() {
    setIsOpen((isOpen) => !isOpen)
  }

  useEffect(() => {
    const getFromCart = async (newCart) => {
      if (!Array.isArray(newCart)) {
        return []
      }

      for (let i = 0; i < newCart.length; ++i) {
        const shop = newCart[i]

        for (let j = 0; j < shop.items.length; ++j) {
          shop.items[j].price = await getItemPriceForStore(
            shop.items[j].id,
            shop.storeID
          )
        }

        shop.sum = shop.items.reduce((prev, curr) => prev + curr.price, 0);
      }

      // console.log(newCart);
      setCart(newCart)
    }

    getFromCart(cart)
  }, [cartTrigger])

  useEffect(() => {
    axios
      .get('localhost:8080/api/stores')
      .then((response) => {
        setAvailableStores(response.data)
      })
      .catch((error) => {
        setError('Error fetching available stores')
        console.error('Error fetching available stores:', error)
      })
  }, []) // получаем список магазинов

  const handleStoreChange = async (selectedStore) => {
    setSelectedStore(selectedStore) // сюда кладем выбранный из списка магазин (из массива выбираем один из)
    try {
      const response = await axios.get(
        `localhost:8080/api/stores/${selectedStore}`
      )

      if (response.status === 200) {
        const locationsObject = response.data.locations // сюда приходят все локации выбранного магазина в формате Maxi Lon:3456
        const locationsArray = Object.keys(locationsObject) // сюда берутся только имена магазинов (ключи)
        setLocations(locationsArray) // сюда кладутся все локации выбранного магазина
        setSelectedLocationsObject(locationsObject) // сюда кладутся пришедшие с бека данные вида {'Maxi Gatineau':8388,'Maxi Buckingham':8389,'Maxi Maniwaki':8624}}
        // console.log(selectedLocationsObject);
      } else {
        setError(
          `Error fetching locations. Server returned: ${response.status}`
        )
        console.error(
          'Error fetching locations. Server returned:',
          response.status
        )
      }
    } catch (error) {
      setError(`Error fetching locations: ${error.message}`)
      console.error('Error fetching locations:', error.message)
    }
  }

  const handleSearchChange = (event) => {
    // тут ищем продукт
    setSearchText(event.target.value)
  }

  const handleLocationChange = async (selectedLocation) => {
    // выбираем локацию из списка
    const newSelectedLocationValue = selectedLocationsObject[selectedLocation] // извлекаем их объекта значение, связанное с ключом selectedLocation
    setSelectedLocationValue(newSelectedLocationValue) // тут теперь хранится value(цифра) выбранной локации
    setSelectedLocation(selectedLocation) // тут только имя локации
  }

  const handleButtonClick = async () => {
    try {
      const response = await axios.post(
        'localhost:8080/api/updateLocation',
        {
          selectedStoresID: selectedStoresID,
          searchText: searchText,
        }
      )
      //console.log('Данные успешно отправлены на бэкенд', response.data)
      const responseData = response.data
      console.log(selectedStoresID)
      setResponseData(responseData)
      //console.log(responseData)
      setIsLoading(false)
    } catch (error) {
      console.error('Ошибка при отправке данных на бэкенд', error)
    }
  }

  const handleAddStore = () => {
    if (!selectedStores.includes(selectedLocation)) {
      setSelectedStores([...selectedStores, selectedLocation]) // кладем выбранные локации в массив
      const newSelectedLocationValue =
        selectedLocationsObject[selectedLocation] // извлекаем их объекта значение, связанное с ключом selectedLocation
      const newStoreLocationObject = {
        store: selectedStore,
        location: selectedLocation
      }
      setSelectedAll((prevSelectedAll) => [
        ...prevSelectedAll,
        newStoreLocationObject
      ])
      setSelectedLocationValue(newSelectedLocationValue) // сюда кладем номер каждого магазина
      setSelectedStoresID([...selectedStoresID, newSelectedLocationValue])// получаем массив из номеров магазинов
    }
  }

  // const lengthMatchesArray = responseData.map(
  //   (product) => selectedAll.length === product.products.length
  // );

  const handleAddToCart = async (product, index) => {
    if (!product) {
      console.error('Invalid product')
      return
    }

    try {
      const updatedCart = cart.map((shop) => ({ ...shop }));

      for (const item of product.products) {
        const storeIndex = updatedCart.findIndex(
          (store) => store.storeID === item.storeID
        )

        if (storeIndex === -1) {
          updatedCart.push({
            storeID: item.storeID,
            storeName: item.store,
            items: [
              {
                name: product.firstName,
                id: item.productID,
              },
            ],
          });
        } else {
          updatedCart[storeIndex].items.push({
            name: product.firstName,
            id: item.productID,
          });
        }
      }

      for (const shop of updatedCart) {
        for (const item of shop.items) {
          item.price = await getItemPriceForStore(item.id, shop.storeID);
        }

        shop.sum = shop.items.reduce((prev, curr) => prev + curr.price, 0);
      }

      const maxItemsLength = Math.max(
        ...updatedCart.map((store) => store.items.length)
      );

      // Дополняем каждый массив items до максимальной длины
      updatedCart.forEach((store) => {
        const itemsCount = store.items.length;

        // Добавляем недостающие элементы
        for (let i = itemsCount; i < maxItemsLength; i++) {
          const newItem = {
            name: 'Doesnt sell at this store',
            id: null, // или используйте уникальный идентификатор
            price: 0, // или установите другое значение по умолчанию
          };

          store.items.push(newItem);
        }
      });

      // Теперь у вас есть массив cartData, в котором все массивы items имеют одинаковую длину
      //console.log(updatedCart);
      setCart(updatedCart);
      saveCartData(updatedCart);
      setCartTrigger({});
      setIsAnimating(true);
      const updatedAddedToCart = [...addedToCart];
      updatedAddedToCart[index] = true;
      setAddedToCart(updatedAddedToCart);

      setTimeout(() => {
        const resetAddedToCart = [...updatedAddedToCart];
        resetAddedToCart[index] = false;
        setAddedToCart(resetAddedToCart);
      }, 3000);

      // Additional actions with the cart, if necessary
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Handle errors appropriately
    }
  }; // works

  setTimeout(() => {
    setIsAnimating(false);
  }, '200');

  const clearData = () => {
    const zeroPriceIndexes = [];

    cart.forEach((store) => {
      store.items.forEach((item, itemIndex) => {
        if (item.price === 0) {
          zeroPriceIndexes.push(itemIndex);
        }
      });
    });
    //console.log(zeroPriceIndexes);
  };

  clearData();

  const saveCartData = (cartData) => {
    localStorage.setItem('cart', JSON.stringify(cartData));
  };

  const loadCartData = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
      //console.log(cart);
    }
  };

  //console.log('cart', cart);

  async function getItemPriceForStore(productId, storeId) {
    if (productId == null) {
      const pr = 0;
      return pr;
    } else {
      const response = await axios.get(
        `https://grocerytracker.ca/api/pc/${storeId}/${productId}`
      );
      const price = response.data;
      const value = price.filter((item) => storeId == item.storeID);
      const pr = value[0].prices[value[0].prices.length - 1].price;
      return pr;
    }
  }

  return (
    <div>
      <Sale/>
    </div>
  )
}

export default StoreSelector;
