const dashboard = document.getElementById('dashboard');
const product = document.getElementById('products');
const myFeedback = document.getElementById('myFeedback');
const container = document.getElementById("productsContainer");
const categoriesDiv = document.getElementById("categories");
product.addEventListener('click', () => {
    closeProductDetails();
    showProductCat();
});
dashboard.addEventListener('click', () => {
    closeProductDetails();
    main();
});
product.addEventListener('click', () => {
    categoriesDiv.classList.toggle('open');
    closeProductDetails();
    showProductCat();
});
myFeedback.addEventListener(('click'), () => {
    closeProductDetails();
    loadMyFeedback();
});
async function showProductCat() {
    try {
        const response = await fetch('https://dummyjson.com/products/categories');
        if (!response.ok) {
            throw new Error("could't load the categories");
        }
        const data = await response.json();
        const filteredData = data.filter((cat) => {
            return cat.name !== 'Groceries';
        });
        categoriesDiv.innerHTML = "";
        categoriesDiv.innerHTML += `
        <button class="allProducts">All Products</button>
        `;
        filteredData.forEach((cat) => {
            categoriesDiv.innerHTML += `
            <button data-cat="${cat.name}">${cat.name}</button>
            `;
        });
    }
    catch (err) {
        console.log(err);
    }
}
async function showAllProducts() {
    try {
        const response = await fetch('https://dummyjson.com/products?limit=194');
        if (!response.ok) {
            throw new Error("can't load the products");
        }
        const data = await response.json();
        const filtered = data.products.filter((product) => {
            return product.category !== "groceries";
        });
        container.innerHTML = "";
        filtered.forEach((product) => {
            const price = product.price.toFixed(2).split(".");
            container.innerHTML += `
                <div class="card" data-id="${product.id}">
                    <img src="${product.thumbnail}" />

                    <div class="info">
                        <h4>${product.title}</h4>
                        
                        <p class="price">
                            <span class="big">${price[0]}</span>
                            <span class="small">.${price[1]}</span>
                        </p>

                    </div>
                </div>
  `;
        });
    }
    catch (err) {
        console.log(err);
    }
}
async function filteredProductCat() {
    categoriesDiv.addEventListener("click", async (e) => {
        closeProductDetails();
        const target = e.target;
        if (target.tagName !== "BUTTON")
            return;
        if (target.classList.contains("allProducts")) {
            container.style.display = "grid";
            showAllProducts();
        }
        const cate = target.getAttribute("data-cat");
        if (!cate)
            return;
        try {
            const response = await fetch('https://dummyjson.com/products?limit=194');
            if (!response.ok) {
                throw new Error('can not load');
            }
            const data = await response.json();
            const filteredChoice = data.products.filter((pro) => {
                return pro.category === cate.toLowerCase().replace(' ', '-');
            });
            container.style.display = "grid";
            container.innerHTML = "";
            filteredChoice.forEach((product) => {
                const price = product.price.toFixed(2).split(".");
                container.innerHTML += `
                <div class="card" data-id="${product.id}">
                    <img src="${product.thumbnail}" />

                    <div class="info">
                        <h4>${product.title}</h4>
                        
                        <p class="price">
                            <span class="big">${price[0]}</span>
                            <span class="small">.${price[1]}</span>
                        </p>

                    </div>
                </div>
            `;
            });
        }
        catch (err) {
            console.log(err);
        }
    });
}
container.addEventListener('click', (e) => {
    const target = e.target;
    if (target.closest('#productDetails'))
        return;
    const card = target.closest('.card');
    if (!card)
        return;
    const id = card.getAttribute('data-id');
    showProductDetails(id);
});
async function showProductDetails(id) {
    if (!id)
        return;
    const response = await fetch(`https://dummyjson.com/products/${id}`);
    const product = await response.json();
    const details = document.getElementById("productDetails");
    details.classList.remove("hidden");
    details.innerHTML = `
    <button class="close-btn">✕</button>
    <img src="${product.thumbnail}" style="width:100%; border-radius:10px;" />

    <h2>${product.title}</h2>

    <p class="price">$${product.price}</p>

    <p>⭐ ${product.rating}</p>

    <div class="reviews">
      <h4>Reviews</h4>
      <div id="reviewsList"></div>
    </div>
    <div id="stars">
        <span data-value="1">☆</span>
        <span data-value="2">☆</span>
        <span data-value="3">☆</span>
        <span data-value="4">☆</span>
        <span data-value="5">☆</span>
    </div>
    <textarea id="reviewInput" placeholder="Write a review..."></textarea>
    <button id="addReview" type="button">Add Review</button>
  `;
    const reviewList = document.getElementById('reviewsList');
    loadReview(Number(id), reviewList);
    let selectedRating = 0;
    const stars = document.querySelectorAll("#stars span");
    stars.forEach((star) => {
        star.addEventListener("click", () => {
            const value = Number(star.getAttribute("data-value"));
            selectedRating = value;
            stars.forEach((s) => {
                const sValue = Number(s.getAttribute("data-value"));
                if (sValue <= value) {
                    s.classList.add("active");
                }
                else {
                    s.classList.remove("active");
                }
            });
        });
    });
    const close = document.querySelector('.close-btn');
    close.addEventListener('click', () => details.classList.add("hidden"));
    const review = document.getElementById('reviewInput');
    const send = document.getElementById('addReview');
    send.addEventListener('click', async () => {
        const user = localStorage.getItem("username");
        if (!user) {
            alert('please log in first');
            return;
        }
        ;
        if (!review.value.trim()) {
            alert("please write a review");
            return;
        }
        await sendReview(Number(id), selectedRating);
    });
}
function closeProductDetails() {
    const details = document.getElementById('productDetails');
    if (!details)
        return;
    details.classList.add('hidden');
}
async function main() {
    const loginBtn = document.getElementById('toLogin');
    const exit = document.getElementById('exit');
    loginBtn.disabled = true;
    exit.disabled = false;
    container.style.display = "block";
    container.innerHTML = `
    <div class="dashboard">

        <h1>Dashboard 📊</h1>

        <div class="section">
        <h2>🆕 What's New</h2>
        <div id="newList" class="wideList"></div>
        </div>

        <div class="section">
        <h2>🏆 Most Reviewed</h2>
        <div id="mostList" class="wideList"></div>
        </div>

        <div class="section">
        <h2>⭐ Highest Rated</h2>
        <div id="topList" class="wideList"></div>
        </div>
    </div>
  `;
    loadDashboardData();
}
async function loadDashboardData() {
    const response = await fetch("https://dummyjson.com/products?limit=100");
    const data = await response.json();
    const products = data.products;
    const newList = document.getElementById("newList");
    newList.innerHTML = "";
    products.slice(0, 5).forEach((p) => {
        newList.innerHTML += `
      <div class="listItem">
        <img src="${p.thumbnail}" />
        <div class="itemInfo">
          <h4>${p.title}</h4>
          <p>New product!!</p>
        </div>
      </div>
    `;
    });
    const mostList = document.getElementById("mostList");
    let mostReviewed = products[0];
    products.forEach((p) => {
        if ((p.reviews?.length) > (mostReviewed.reviews?.length || 0)) {
            mostReviewed = p;
        }
    });
    mostList.innerHTML = `
    <div class="listItem">
      <img src="${mostReviewed.thumbnail}" />
      <div class="itemInfo">
        <h4>${mostReviewed.title}</h4>
        <p>${mostReviewed.reviews?.length || 0} reviews</p>
      </div>
    </div>
  `;
    const topList = document.getElementById("topList");
    let highestRated = products[0];
    products.forEach((p) => {
        if (p.rating > highestRated.rating) {
            highestRated = p;
        }
    });
    topList.innerHTML = `
    <div class="listItem">
      <img src="${highestRated.thumbnail}" />
      <div class="itemInfo">
        <h4>${highestRated.title}</h4>
        <p class="stars">⭐ ${highestRated.rating}</p>
      </div>
    </div>
  `;
}
function logIn() {
    const loginBtn = document.getElementById('toLogin');
    const exit = document.getElementById('exit');
    loginBtn.disabled = false;
    exit.disabled = true;
    container.style.display = "flex";
    container.innerHTML = "";
    container.innerHTML = `
    <div class="loginPage">
      <div class="loginBox">
        <h2>Welcome 💜</h2>
        <p>Enter your name to continue</p>

        <input id="usernameInput" placeholder="Your name..." />

        <button id="loginBtn">Enter</button>
        <p id="note">*if you're new here, just enter your name and your account will be created</p>
      </div>

      <div id="loadingScreen">
        <div class="loader"></div>
      </div>
    </div>
    `;
    const name = document.getElementById('usernameInput');
    const login = document.getElementById('loginBtn');
    login.addEventListener('click', () => {
        if (!name.value.trim()) {
            alert("please login first");
            return;
        }
        else {
            const username = name.value.trim();
            localStorage.setItem("username", username);
            const loading = document.getElementById("loadingScreen");
            loading?.classList.add("active");
            const writtenUser = document.getElementById('name');
            setTimeout(() => {
                main();
                const img = document.getElementById('img');
                writtenUser.innerText = username;
                img.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`;
            }, 1500);
        }
    });
}
;
async function sendReview(productId, selectedRating) {
    const input = document.getElementById("reviewInput");
    if (!input)
        return;
    const comment = input.value.trim();
    if (!comment)
        return;
    const reviewerName = localStorage.getItem("username");
    if (!reviewerName) {
        alert('please login first');
        return;
    }
    const newReview = {
        reviewerName,
        comment,
        rating: selectedRating,
        date: new Date().toISOString()
    };
    await fetch("http://localhost:3001/review", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            reviewerName,
            productId,
            rating: selectedRating,
            comment
        })
    });
    addReviewToUl(newReview);
    input.value = "";
}
function addReviewToUl(newReview) {
    const reviewList = document.getElementById('reviewsList');
    const div = document.createElement('div');
    div.classList.add('review');
    const dateObj = new Date(newReview.date);
    const niceDate = dateObj.toLocaleDateString();
    const stars = "⭐".repeat(newReview.rating) + "☆".repeat(5 - newReview.rating);
    div.innerHTML = `
        <h5>${newReview.reviewerName}</h5>
        <span class="date">${niceDate}</span>
        <div class="rating">${stars}</div>
        <div class="rating">${newReview.rating}</div>
        <p>${newReview.comment}</p>
    `;
    reviewList.appendChild(div);
}
async function loadReview(productId, reviewList) {
    const response = await fetch(`https://dummyjson.com/products/${productId}`);
    const product = await response.json();
    const responseUser = await fetch(`http://localhost:3001/reviews/product/${productId}`);
    const productUser = await responseUser.json();
    const allReviews = [...product.reviews, ...productUser];
    allReviews.forEach((rev) => {
        const dateObj = new Date(rev.date);
        const niceDate = dateObj.toLocaleDateString();
        const fullStars = "⭐".repeat(rev.rating);
        const emptyStars = "☆".repeat(5 - rev.rating);
        const stars = fullStars + emptyStars;
        const div = document.createElement('div');
        div.classList.add('review');
        div.innerHTML = `
        <div class="review">
        <h5>${rev.reviewerName}</h5>
        <span class="date">${niceDate}</span>
        <div class="rating">${stars}</div>
        <div class="rating">${rev.rating}</div>
        <p>${rev.comment}</p>
        </div>
        `;
        reviewList.appendChild(div);
    });
}
async function loadMyFeedback() {
    container.className = "";
    container.style.display = "block";
    const user = localStorage.getItem("username");
    if (!user)
        return;
    container.innerHTML = `
    <div class="myFeedbackPage">
      <h1>My Feedback 💬</h1>
      <div id="myReviewsList"></div>
    </div>
  `;
    const list = document.getElementById("myReviewsList");
    list.innerHTML = "<p>Loading...</p>";
    const res = await fetch(`http://localhost:3001/reviews/user/${user}`);
    const reviews = await res.json();
    const productPromises = reviews.map((rev) => fetch(`https://dummyjson.com/products/${rev.productId}`)
        .then(res => res.json()));
    const products = await Promise.all(productPromises);
    let html = "";
    reviews.forEach((rev, i) => {
        const product = products[i];
        const stars = "⭐".repeat(rev.rating) + "☆".repeat(5 - rev.rating);
        html += `
      <div class="myReviewCard">
        <img src="${product.thumbnail}" />
        <div class="content">
          <h4>${product.title}</h4>
          <div class="stars">${stars}</div>
          <p>${rev.comment}</p>
        </div>
      </div>
    `;
    });
    list.innerHTML = html;
}
function loadUser() {
    const user = localStorage.getItem('username');
    const exit = document.getElementById('exit');
    if (!user) {
        exit.disabled = true;
        return;
    }
    ;
    exit.disabled = false;
    const writtenUser = document.getElementById('name');
    const img = document.getElementById('img');
    writtenUser.innerText = user;
    img.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${user}`;
}
function exitUser() {
    const loginBtn = document.getElementById('toLogin');
    const exit = document.getElementById('exit');
    exit.addEventListener('click', () => {
        closeProductDetails();
        const result = confirm('are you sure you want to exit?');
        if (!result)
            return;
        localStorage.removeItem("username");
        const writtenUser = document.getElementById('name');
        writtenUser.innerText = "User";
        const img = document.getElementById('img');
        img.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${writtenUser}`;
        loginBtn.disabled = false;
        exit.disabled = true;
        logIn();
    });
}
function init() {
    const nameElm = document.getElementById('name');
    const user = localStorage.getItem('username');
    if (!nameElm)
        return;
    if (user) {
        closeProductDetails();
        main();
    }
    else {
        closeProductDetails();
        nameElm.innerText = "User";
        logIn();
    }
}
init();
loadUser();
showProductCat();
filteredProductCat();
exitUser();
const logInBtn = document.getElementById('toLogin');
logInBtn?.addEventListener(('click'), () => {
    closeProductDetails();
    logIn();
});
export {};
