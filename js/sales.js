var sales = (function(sales) {

  // console.log("sales page loaded");

  var products = {};
  var categories = {};
  var productDiv = "";

  ///////////////////////////
  ///JSON PARSERS (run sequentially/are connected so nothing else starts until both are loaded)
  ///////////////////////////
  sales.parseCategories = function() {
    // console.log("ready to parse categories json");
    categories = JSON.parse(categoriesRequest.responseText).categories;
    console.log("categories object", categories);
    sales.addProductToGrid(products);
  },

  sales.parseProducts = function() {
    // console.log("ready to parse products json");
    products = JSON.parse(productsRequest.responseText).products;
    console.log("products object", products);
    sales.parseCategories(); 
  },



  //function to run in case the json fails to load.
  sales.jsonError = function() {
    console.log("json failed to load");
  },


  /////////////////////////////////////
  ///PRODUCT GRID CREATOR
  /////////////////////////////////////

  sales.makeProductDiv = function() {
    let productDiv = document.createElement("div");
    productDiv.className = "aproduct";
    productGrid.appendChild(productDiv);
    return productDiv;
  },

  sales.addProductToGrid = function(products) {
    products.forEach(function(product, index) {

      console.log("product", product.name);

      productDiv = sales.makeProductDiv()
      //attach unique ID to each div, from the object's 'ID' key value.
      productDiv.id = `${product.id}master`;
      // console.log("product id", productDiv.id);
       
      //this function loop connects the product category_id and the season name from the category json. 
      var productCategory = "";
      var findProductCategory = function() {
        for (var i = 0; i < categories.length; i++) {
          if (product.category_id === categories[i].id) {
            productCategory = categories[i];
            // console.log("match!", productCategory);
            return productCategory;
          } 
        }
      }
      findProductCategory();
      
      //sets inner HTML of the product card. 
      productDiv.innerHTML = `<p>${product.name}</p>
                              <p class = "tiny">category: ${productCategory.name}</p>
                              <h5 id = ${product.id} class="productPrices ${productCategory.season_discount}">Price: $${product.price}</h5>`
    });
  }


  ////////////////////////
  ///DISCOUNTER BOX FUNCTION. note, would have put this into a separate module but then it wouldn't grab the 'categories' or 'products' variables correctly. I think that issue has something to do with the modularization thing.
  ////////////////////////
  
  sales.applySeasonalDiscount = function(event) {

    var currentSeason = "";
    var currentDiscount = "";
    var currentPrice;
    //this .map method goes through the selector options and finds which one is selected. Assigns a 'currentSeason' variable to winter, spring, autumn, or winter. 
    Array.from(seasonSelector.options).map(function(season){
      if (season.selected === true) {
        currentSeasonName = season.value;


        //once current season name is found, loop through the CATEGORIES ARRAY to assign the corresponding discount. 
        for (var i = 0; i < categories.length; i++) {
          if (currentSeasonName === categories[i].season_discount) {
            currentDiscount = categories[i].discount;
          }
        }
      };
    });
      //now I have the season name and the discount. 
        console.log("current season name", currentSeasonName );
        console.log("current discount", currentDiscount );

    //make an array of all the products now, so I can reset to normal price any item that was previously on sale. Note this works because it grabs the first class. I wish I could use the same type of thing on the below loop to find whether the class matches the current season, but then the 'else' setting back to the undiscounted price doesn't work. 
    
    var allTheItems = Array.from(document.getElementsByClassName("productPrices"));
    // console.log("array", allTheItems);

    //loop through the item array
    allTheItems.map(function(item){
      //sets the current price for each item by using the *id assigned* when originally creating the div (not the price actually displayed on the DOM).
      for (var i = 0; i < products.length; i++) {
        if (products[i].id === parseInt(item.id)) {
          currentPrice = products[i].price;
          // console.log("current price", products[i].name, currentPrice);
        } 
      }


      /////////////
      ///Assigns the price of each item based on whether, per its class, it is in season. 
      //////////////
      
      var arrayOfClasses = Array.from(item.classList);


      var setSeasonPrice = function () {
      for (var i = 0; i < arrayOfClasses.length; i++) {
        if(arrayOfClasses[i] === currentSeasonName) {
        // console.log("I'm in season");
          let discountedPrice = currentPrice * (1 - currentDiscount);
          item.innerHTML = `Discounted price: $${discountedPrice.toFixed(2)}`; 
          break;
        } else {
        // console.log("I'm not in season" );
          item.innerHTML = `Price: ${currentPrice}`;
        }
      }
    }
    setSeasonPrice();
  });
  }

return sales;
}(sales || {}))


 
