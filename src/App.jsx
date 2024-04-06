import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


function App() {
  const [count, setCount] = useState(0)
  const [image, setImage] = useState();


  const getCurrentTab = async () => {
    let queryOptions = {active: true, lastFocusedWindow: true};
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  };

  const onclick = async () => {

    const tab = await getCurrentTab();
    console.log('tab:', tab);
    chrome.tabs.sendMessage(
      tab.id || 0,
      {action: "PING"},
      (response) => {
        console.log("response.title:", response);
      }
    );

    // let [tab] = await chrome.tabs.query({active: true});
    // chrome.scripting.executeScript({
    //   target: {tabId: tab.id},
    //   func: () => {
    //     // alert('hey');
    //     console.log('document:', document.body);
    //     document.body.style.backgroundColor = 'red';
    //     const test = document.getElementsByClassName('shopee-button');
    //     console.log('test!!!', test);


    //   }
    // })
  }

  // useEffect(async() => {
  //   let [tab] = await chrome.tabs.query({active: true});
  //   chrome.scripting.executeScript({
  //     target: {tabId: tab.id},
  //     func: (setImage) => {
  //       // alert('hey');
  //       console.log('document:', document.body);
  //       const test = document.getElementsByClassName('shopee-button');
  //       console.log('test', test);
  //       console.log('url: ', window.location.href);
  //       const imageLink = document.getElementsByClassName('gallery-preview-panel__image');
  //       console.log('imageLink:', imageLink[0].src);
  //       console.log('setImage:', setImage);
  //       setImage(imageLink[0].src)
  //     },
  //     args: [ setImage ]
  //   })
  // }, [])
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
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={onclick}> On Click</button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
