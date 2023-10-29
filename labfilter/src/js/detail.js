let product;

fetch("db.json")
.then(res => res.json())
.then(data => {
    let productId = JSON.parse(localStorage.getItem("productdetailindex"))

    if(productId){
        product = data.products.find(a => a.id == productId)
        console.log(product)
    }
})
