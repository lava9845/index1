let shop=document.getElementById('shop');
let shopItemsData=[{
    id:"123",
    name:"Casual Top",
    price:150,
    desc:"Lorem ipsum dolor sit amet consectetur.",
    img:"images/img1.jpg"
    },
    {
    id:"234",
    name:"Cotton Top",
    price:200,
    desc:"Lorem ipsum dolor sit amet consectetur.",
    img:"images/img2.jpg"
    },
    {
    id:"345",
    name:"Office Top",
    price:280,
    desc:"Lorem ipsum dolor sit amet consectetur.",
    img:"images/img3.jpg"   
    },
    {
    id:"456",
    name:"T-shirt",
    price:120,
    desc:"Lorem ipsum dolor sit amet consectetur.",
    img:"images/img4.jpg"      
    },
];
let basket=[];
let generateShop=()=>{
    return (shop.innerHTML=shopItemsData.map((x)=>{
        let{id,name,price,desc,img}=x;
        return `
           <div id=product-id-${id} class="item">
        <img width="218" src=${img} alt="">
        <div class="details">
            <h3>${name}</h3>
            <p>${desc}</p>
            <div class="price-quantity"></div>
            <h2>$ ${price}</h2>
            <div class="button">
                <i onclick="decrement()" class="bi bi-dash-lg"></i>
                 <div id=${id} class="quantity">0</div>
                 <i onclick="increment()" class="bi bi-plus-lg"></i>
            </div>
        </div>
    </div>
    `})
.join(""));
};
generateShop();
let increment= (id)=>{
    let selectedItem=id;
    let search=basket.find((x)=>x.id === selectedItem.id);
    if(search===undefined){
       basket.push({
        id:selectedItem.id,
        item:1,
      }); 
    } else {
        search.item +=1;
    }
console.log(basket);
};
let decrement= ()=>{
    let selectedItem=id;
    let search=basket.find((x)=>x.id === selectedItem.id);
    if(search===undefined){
       basket.push({
        id:selectedItem.id,
        item:1,
      }); 
    } else {
        search.item -=1;
    }
console.log(basket);
};
let update= ()=>{};
