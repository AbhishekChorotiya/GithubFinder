// main.js

var current_page = 1;
var max_page = 15;
var repo_per_page = 10;
var username = '';
async function getUserData(v) {
  try {
    const res = await fetch(`https://api.github.com/users/${v}`);
    const data = await res.json();

    const name = data.name?data.name:'xyz';
    username = data.login
    const date = new Date(data.created_at)
    const arr = date.toString().split(" ")
    const joined = arr[2]+' '+arr[1]+', '+arr[3]

    max_page = Math.ceil(data.public_repos / repo_per_page);

    getData(username,1,10)
    loadFooter()

    document.getElementById('name').innerHTML = name
    document.getElementById('id').innerHTML = `@${username}`
    document.getElementById('id').href = `https://github.com/${username}`
    document.getElementById('joined').innerHTML = `Joined : ${joined}`
    document.getElementById('desc').innerHTML = data.bio
    document.getElementById('repos').innerHTML = 'Repos : ' +data.public_repos
    document.getElementById('followers').innerHTML = 'Followers : '+data.followers
    document.getElementById('following').innerHTML = 'Following : '+data.following
    document.getElementById('location_name').textContent = data.location.split(',').join(', ')
    document.getElementById('img').src = data.avatar_url

  } catch (e) {
    console.log("error in fetching : ", e);
  }
}

async function getData(username,page, perPage) {
  try {
    const reposContainer = document.querySelector(".repos");
    reposContainer.innerHTML = "";
    current_page = page;
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}`
    );
    const data = await res.json();
    console.log(data);

    // Your array
    const dataArray = data;

    // Get the repos container

    // Iterate through the array and create card divs
    dataArray.forEach((item) => {
      const cardDiv = document.createElement("div");
      cardDiv.classList.add("card");
      const nameDiv = document.createElement("div");
      nameDiv.classList.add("name");
      const descDiv = document.createElement("div");
      descDiv.classList.add("desc");
      const topicsDiv = document.createElement("div");
      topicsDiv.classList.add("topics");

      // cardDiv.textContent = item.name;
      nameDiv.textContent = item.name;
      descDiv.textContent = item.description;

      item.topics.forEach((a) => {
        const span = document.createElement("span");
        span.textContent = a;
        topicsDiv.appendChild(span);
      });

      // Append the card div to the repos container

      cardDiv.addEventListener("click", () => {
        window.open(item.html_url, "_blank");
      });

      reposContainer.appendChild(cardDiv);
      cardDiv.appendChild(nameDiv);
      cardDiv.appendChild(descDiv);
      cardDiv.appendChild(topicsDiv);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const button = document.querySelector(".search");
console.log(button);

button.addEventListener("click", () => {
  getUserData(document.querySelector(".username").value)
  console.log(document.querySelector(".username").value)
});

const pageno = document.getElementsByClassName("pageno");

function loadFooter() {
  const pagesDiv = document.querySelector(".pages");
  pagesDiv.innerHTML = ''
  console.log(pagesDiv);

  const prevDiv = document.createElement("div");
  prevDiv.classList.add("prev");
  prevDiv.innerHTML = "prev";
  pagesDiv.appendChild(prevDiv);

  for (let i = 1; i <= max_page; i++) {
    const pageno = document.createElement("div");
    pageno.classList.add("pageno");
    pageno.innerHTML = i;
    pagesDiv.append(pageno);
  }

  const nextDiv = document.createElement("div");
  nextDiv.classList.add("next");
  nextDiv.innerHTML = "next";
  pagesDiv.append(nextDiv);

  for (let val of pageno) {
    val.addEventListener("click", () => {
      getData(username,parseInt(val.innerHTML), repo_per_page);
    });
  }

  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");

  prevBtn.addEventListener("click", () => {
    getData(username,Math.max(1, current_page - 1), repo_per_page);
  });

  nextBtn.addEventListener("click", () => {
    getData(username,Math.min(current_page + 1, max_page), repo_per_page);
  });
}
