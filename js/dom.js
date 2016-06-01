// console.log("dom page loaded" );

//json loader for products.
var productsRequest = new XMLHttpRequest();
productsRequest.open("GET", "data/products.json");
productsRequest.send();
productsRequest.addEventListener("load", callCategories);
productsRequest.addEventListener("error", sales.jsonError);


//json loader for categories. Put into a function so it will run after products is complete and both are guaranteed to be loaded when other functions start happening.

var categoriesRequest = new XMLHttpRequest();
function callCategories() {
  // console.log("products is loaded");
  categoriesRequest.open("GET", "data/categories.json");
  categoriesRequest.send();
  categoriesRequest.addEventListener("load", sales.parseProducts);
  categoriesRequest.addEventListener("error", sales.jsonError);
}




//selector for the product grid where all the products get injected. 
var productGrid = document.getElementById("productGrid"); 

//selector and event listener for the seasonal discount dropdown menu. 
var seasonSelector = document.getElementById("seasonSelector");
      // console.log("seasonSelector", seasonSelector );
seasonSelector.addEventListener("change", sales.applySeasonalDiscount);
