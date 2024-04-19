import {useEffect, useState} from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [image, setImage] = useState();

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
        const file = new Blob([blob], {type: "application/pdf"});
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      }
    );
  };
  const getOrderDetails = async () => {
    const tab = await getCurrentTab();
    console.log("tab:", tab);
    chrome.tabs.sendMessage(
      tab.id || 0,
      {action: "LOAD_ORDER"},
      async (response) => {
        console.log("response:", response);
        //  console.log("response.title:", response);
        //  const data = await fetch('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
        //  const blob = await data.blob();
        //  const file = new Blob([blob], {type: 'application/pdf'});
        //  const fileURL = URL.createObjectURL(file);
        //  window.open(fileURL);
        console.log("response.title:", response);
        const data = await fetch("http://localhost:3000/testapi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(response),
        });
        const blob = await data.blob();
        const file = new Blob([blob], {type: "application/pdf"});
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      }
    );
  }
  useEffect(() => {
    getOrderDetails();
  }, [])
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">

        <button
          onClick={async () => {
            getOrderDetails();
          }}
        >
          Reload Order Details
        </button>

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
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
