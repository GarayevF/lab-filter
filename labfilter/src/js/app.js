const rangeInput = document.querySelectorAll("#price-sub .range-input input"),
priceInput = document.querySelectorAll("#price-sub .price-input input"),
range = document.querySelector("#price-sub .slider .progress");
let priceGap = 500;

let categoryIds = [];

let priceFilterMin;
let priceFilterMax;

let database;


// Qiymət inputlarında dəyişiklik olduqda işə düşür

priceInput.forEach(input =>{
    input.addEventListener("input", e =>{
        let minPrice = parseInt(priceInput[0].value);
        let maxPrice = parseInt(priceInput[1].value);
        
        if((maxPrice - minPrice >= priceGap) && maxPrice <= rangeInput[1].max){
            if(e.target.className === "input-min"){
                rangeInput[0].value = minPrice;
                range.style.left = ((minPrice / rangeInput[0].max) * 100) + "%";
            }else{
                rangeInput[1].value = maxPrice;
                range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
            }
        }

        priceFilterMin = minPrice;
        priceFilterMax = maxPrice;
        
        updateProducts()
    });
});

// Qiymət sliderində dəyişiklik olduqda işə düşür

rangeInput.forEach(input =>{
    input.addEventListener("input", e =>{
        let minVal = parseInt(rangeInput[0].value);
        let maxVal = parseInt(rangeInput[1].value);

        if((maxVal - minVal) < priceGap){
            if(e.target.className === "range-min"){
                rangeInput[0].value = maxVal - priceGap;
                priceInput[0].value = maxVal - priceGap;
                range.style.left = (((maxVal - priceGap) / rangeInput[0].max) * 100) + "%";
            }else{
                rangeInput[1].value = minVal + priceGap;
                priceInput[1].value = minVal + priceGap;
                range.style.right = 100 - ((minVal + priceGap) / rangeInput[1].max) * 100 + "%";
            }
        }else{
            priceInput[0].value = minVal;
            priceInput[1].value = maxVal;
            range.style.left = ((minVal / rangeInput[0].max) * 100) + "%";
            range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
        }

        priceFilterMin = minVal;
        priceFilterMax = maxVal;

        updateProducts()
    });
});

fetch("db.json")
.then(res => res.json())
.then(data => {
    database = data;
    
    let categoryul = document.querySelector("#categoryul")

    let html = "";

    database.categories.forEach(category => {
        html +=
            `
                <li>
                    <a href="#" class="category-item" data-id="${category.id}">${category.name}</a>
                </li>
            `
    })
    categoryul.innerHTML = html

    let category_items = document.querySelectorAll(".category-item");

    category_items.forEach(category => {
        category.addEventListener("click", function() {

            let categoryId = category.getAttribute("data-id");
            
            if(categoryIds.includes(categoryId)) {
                categoryIds.splice(categoryIds.indexOf(categoryId), 1);
                category.parentElement.classList.remove("active")
            }else{
                categoryIds.push(categoryId)
                category.parentElement.classList.add("active")
            }
            
            updateProducts();
        })
    })

    updateProducts();
})


function updateProducts(){
    
    let container = document.querySelector(".inner-container")
    let html = ""
    database.products.forEach(product => {
        
        if( (!priceFilterMin || product.price >= priceFilterMin) &&
            (!priceFilterMax || product.price <= priceFilterMax) &&
            (categoryIds.length == 0 || categoryIds.includes(String(product.categoryId)))
        ){
            html += 
            `
                <a href="/detail.html">
                    <div data-id="${product.id}" class="card">
                    <div class="img-div">
                        <img src="${product.image}" alt="">
                    </div>
                    <div class="content">
                        <span class="title">${product.title}</span>
                        <span class="price">${product.price}</span>
                    </div>
                </div>
                </a>
            `
        }
    })

    container.innerHTML = html;
}



