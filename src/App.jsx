import {useEffect, useRef, useState} from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [image, setImage] = useState();
  const [orderData, setOrderData] = useState();
  const loadRef = useRef();
  const getCurrentTab = async () => {
    let queryOptions = {active: true, lastFocusedWindow: true};
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  };

  const onclick = async () => {
    const tab = await getCurrentTab();
    console.log("tab:", tab);
    chrome.tabs.sendMessage(
      tab.id || 0,
      {action: "PING"},
      async (response) => {
        console.log("response.title:", response);
        const data = await fetch("http://localhost:3000/testapi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(response),
        });

        const blob = await data.blob();
        console.log('data:', data);
        const file = new Blob([blob], {type: "application/pdf"});
        const fileURL = URL.createObjectURL(file);
        // window.open(fileURL);
      }
    );
  };
  const generateReceipt = async () => {

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("data", JSON.stringify(orderData));

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow"
    };

    const fetchData = await fetch("http://localhost:3000/testapi", requestOptions)
    const blob = await fetchData.blob();
    const file = new Blob([blob], {type: "application/pdf"});
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));

  };
  const getOrderDetails = async () => {

    console.log('waiting');
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log('starting');
    const tab = await getCurrentTab();
    console.log("tab:", tab);
    chrome.tabs.sendMessage(
      tab.id || 0,
      {action: "LOAD_ORDER"},
      async (response) => {
        console.log("response:", response);
        // console.log("response.title:", response);
        // const data = await fetch('http://localhost:3000/testapi');
        // const blob = await data.blob();
        // const file = new Blob([blob], {type: 'application/pdf'});
        // const fileURL = URL.createObjectURL(file);
        // window.open(fileURL);
        if (response) {
          console.log("response.title:", response);
          setOrderData(response);
          // const data = await fetch("http://localhost:3000/testapi", {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          //   body: JSON.stringify(response),
          // });
          // const blob = await data.blob();
          // console.log('blob:', blob);
          // const file = new Blob([blob], {type: "application/pdf"});
          // const fileURL = URL.createObjectURL(file);
          // window.open(fileURL);
        }
      }
    );
  }
  // const orderData = {
  //   name: 'Stephen Tan',
  //   address: '312 Roxas Seafront Garden, Pasay City',
  //   items: [
  //     {
  //       name: 'Product 1',
  //       sku: 'SKU-1',
  //       price: 100,
  //       quantity: 2,
  //       subtotal: 200
  //     },
  //     {
  //       name: 'Product 2',
  //       sku: 'SKU-2',
  //       price: 200,
  //       quantity: 1,
  //       subtotal: 200
  //     }
  //   ],
  //   total: 1000
  // }
  useEffect(() => {
    // setTimeout(() => {
    //   loadRef.current.click();
    // }, 3000);

  }, [])
  return (
    <>
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-24 ">
        <div className="flex justify-center">
          {orderData ? <a className="border border-gray-300 p-2 rounded-md" onClick={() => {
            generateReceipt();
          }}>
            Generate Receipt
            <span aria-hidden="true"> &rarr;</span>
          </a> : <a className="border border-gray-300 p-2 rounded-md " ref={loadRef} onClick={() => {getOrderDetails()}}>Load Order</a>}

        </div>
        {orderData && (

          <div >
            <h1 className="text-sm font-medium text-indigo-600">Receipt Printer</h1>
            <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 ">Order 234234234</p>
            <p className="mt-2 text-base text-gray-500">

            </p>

            <dl className="mt-12 text-sm font-medium">
              <dt className="text-gray-900">Customer Name</dt>
              <dd className="mt-2 text-indigo-600">{orderData?.name}</dd>
            </dl>

            <dl className="mt-5 text-sm font-medium">
              <dt className="text-gray-900">Shipping Address</dt>
              <dd className="mt-2 text-indigo-600">{orderData?.address}</dd>
            </dl>

            <ul
              role="list"
              className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-gray-500"
            >
              {orderData?.items.map((product, index) => (
                <li key={index} className="flex space-x-6 py-6">

                  <div className="flex-auto space-y-1">
                    <h3 className="text-gray-900">
                      <a href={product.href}>{product.sku} - {product.name} </a>
                    </h3>
                    <p>qty: {product.quantity}</p>
                    <p>price: {product.price}</p>
                  </div>
                  <p className="flex-none font-medium text-gray-900">₱ {product.subtotal}</p>
                </li>
              ))}
            </ul>

            <dl className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-gray-500">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="text-gray-900">₱ {orderData.total}</dd>
              </div>

              {/* <div className="flex justify-between">
              <dt>Shipping</dt>
              <dd className="text-gray-900">$8.00</dd>
            </div>

            <div className="flex justify-between">
              <dt>Taxes</dt>
              <dd className="text-gray-900">$6.40</dd>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
              <dt className="text-base">Total</dt>
              <dd className="text-base">$86.40</dd>
            </div> */}
            </dl>



            {/* <div className="mt-16 border-t border-gray-200 py-6 text-right">
              <a onClick={() => {
                generateReceipt();
              }} href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Generate Receipt
                <span aria-hidden="true"> &rarr;</span>
              </a>
            </div> */}
          </div>
        )}
      </div>
      {/* <div className="max-w-3xl px-5 mx-auto">
        <div>
          <label>Order Id</label>
          <div>2343242342</div>
        </div>
      </div>
      <div>
        Order Loader
      </div>
      <h1>Order Loader</h1>
      <div className="card">

        <button
          onClick={async () => {
            getOrderDetails();
          }}
        >
          Reload Order Details
        </button> */}
      {/* <button onClick={onclick}> On Click</button>
        <button
          onClick={async () => {
            const myHeaders = new Headers();
            myHeaders.append(
              "Content-Type",
              "application/x-www-form-urlencoded"
            );

            const urlencoded = new URLSearchParams();
            urlencoded.append("data", "{test: 'abc'}");

            const requestOptions = {
              method: "POST",
              headers: myHeaders,
              body: urlencoded,
              redirect: "follow",
            };

            const result = await fetch(
              "http://localhost:3000/testapi",
              requestOptions
            );
            const blob = await result.blob();

            const file = new Blob([blob], {type: "application/pdf"});
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
          }}
        >
          Click click
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p> */}
      {/* </div> */}

    </>
  );
}

export default App;
