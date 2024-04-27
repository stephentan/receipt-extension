console.log("Starting Receipt Printer v1.1");

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("msg: ", message, " sender: ", sender);
  if (message.action === "LOAD_ORDER") {
    console.log("ping");
    const orderData = { items: [] };
    document.querySelectorAll(".header .name").forEach((entry) => {
      console.log("entry:", entry.innerHTML.trim() === "Order ID");
      if (entry.innerHTML.trim() === "Order ID") {
        console.log(
          "---> ",
          entry.closest(".section").querySelector(".body > div").innerHTML
        );
        orderData.orderId = entry
          .closest(".section")
          .querySelector(".body > div").innerHTML;
      }
    });
    let total = 0;
    document.querySelectorAll(".product-list-item").forEach((entry, index) => {
      console.log("---> ", entry.querySelector(".product-detail > div")?.title);
      console.log(
        "---> ",
        entry.querySelector(".product-detail .product-meta > div")?.innerHTML
      );
      if (index > 0) {
        console.log(" price", entry.querySelector(".price")?.innerHTML);
        console.log(" quantity", entry.querySelector(".qty")?.innerHTML);
        console.log(" subtotal", entry.querySelector(".subtotal")?.innerHTML);
        orderData.items.push({
          name: entry.querySelector(".product-detail > div")?.title,
          sku: entry.querySelector(".product-detail .product-meta > div")
            ?.innerHTML,
          price: parseFloat(entry.querySelector(".price")?.innerHTML),
          quantity: parseFloat(entry.querySelector(".qty")?.innerHTML),
          subtotal: parseFloat(entry.querySelector(".subtotal")?.innerHTML),
        });
        total += parseFloat(entry.querySelector(".subtotal")?.innerHTML);
      }
    });
    orderData.total = total;
    console.log(
      document.querySelectorAll(".order-invoice-body .value")[0].innerHTML
    );
    console.log(
      document.querySelectorAll(".order-invoice-body .value")[1].innerHTML
    );
    orderData.name = document.querySelectorAll(
      ".order-invoice-body .value"
    )[0].innerHTML;
    orderData.address = document.querySelectorAll(
      ".order-invoice-body .value"
    )[1].innerHTML;

    sendResponse(orderData);
  }
});
