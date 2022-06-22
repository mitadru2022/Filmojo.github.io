// $("#main2").hide();
$("#info").hide();
$("#main2").hide();
$("#back2").hide();

var isSearch = false;
var stack = [];
var count = 1;

const movielist = ['tt6455162','tt9179430', 'tt7466810', 'tt9851854','tt8041270'];
var url = "https://www.omdbapi.com/?apikey=1f219e9c&i="
var imgurl = "https://img.omdbapi.com/?apikey=1f219e9c&i="

ShowMovies();

function ShowMovies() {
  for(let i=0; i<movielist.length; i++){
    var url2 = url + movielist[i];
    var imgurl2 = imgurl + movielist[i];
    // console.log(url2);

    function ReplaceData() {
      fetch(url2).then(res => res.json())
        .then(data => {
          var x = i+1;
          var curID = '#m'+ String(x);
          $(`${curID} > .filmbox > h2`).html(data.Title);
          $(`${curID} > .filmbox > p`).html(data.Genre);
          $(`${curID} > .filmbox > .id`).html(data.imdbID);
          $(`${curID} > img`).attr({src: data.Poster});
        });
    }
    ReplaceData();
  }
}

async function showInfo(eve) {
  const name = eve.innerText.split(/\r?\n/)[4];
  //we have to use imdbid instead of title
  // console.log(url+name);
  await fetch(url+name).then(res => res.json())
    .then(data => {
      $(`#info > .left-info > h2`).text(data.Title);
      $(`#info > .left-info > h3`).text(data.Genre);
      $(`#info > .left-info > #rate`).text("IMDb: " + data.imdbRating);
      if(data.Released==="N/A") $(`#info > .left-info > #dated`).text("Released:  " + data.Year);
      else $(`#info > .left-info > #dated`).text("Released:  " + data.Released);
      $(`#info > .left-info > #run`).text("Runtime:  " + data.Runtime);
      $(`#info > .left-info > #dir`).text("Director:  " + data.Director);
      $(`#info > .left-info > #lang`).text(data.Language + " " + data.Type);
      $(`#info > .left-info > #wri`).text("Writer:  " + data.Writer);
      $(`#info > .left-info > #act`).text(data.Actors);
      $(`#info > .left-info > p`).text(data.Plot);
      if(data.Poster==="N/A") $(`#info > .right-info > img`).attr({src: "notFound.png"});
      else $(`#info > .right-info > img`).attr({src: data.Poster});
    });
  $("#main").slideUp();
  $("#main2").slideUp();
  $("h1").slideUp();
  $("#info").slideDown();
  $("#back2").slideUp();
}

$("#back").click(function () {
  $("#info").slideUp();
  if(isSearch){
    $("#main2").slideDown();
    $("#back2").slideDown();
  }
  else {
    $("#main").slideDown();
    $("h1").slideDown();
  }
});

$(".trendz").click(function () {
  $("#main").slideDown();
  $("h1").slideDown();
  $("#info").slideUp();
  $("#main2").slideUp();
  $("#back2").slideUp();
  isSearch = false;
});


// SEARCH Movies

$("#search").click(async function () {
  $("h1").slideUp();
  $("#info").slideUp();
  $("#main").slideUp();
  $("#back2").slideDown();
  $("#main2").slideDown();

  var quary = $("#search-box").val();
  stack.push(quary);
  count = 1;
  displayAllMovies(quary);
});

async function displayAllMovies(quary) {
  document.getElementById("search-box").value = quary;
  var call = "https://www.omdbapi.com/?apikey=1f219e9c&s="
  var arr = quary.split(" ");
  call += arr[0];
  for(let i=1; i<arr.length; i++){
    if(arr[i]=="") continue;
    call += "+" + arr[i];
  }

  var myMovieDivs = document.getElementById("main2");
  myMovieDivs.innerHTML = "";

  await fetch(call).then(res => res.json()).then(data =>{
    for(let i=0; i<data.Search.length; i++){
      var t = data.Search[i].Title;
      var im = data.Search[i].Poster;
      if(im === "N/A") im = "notFound.png";
      var y = data.Search[i].Year;
      var id = data.Search[i].imdbID;
      myMovieDivs.innerHTML += `<div class="display" onclick="showInfo(this)">
        <img src="${im}" alt="" height="200" width="160">
        <div class="filmbox">
          <h2 class="boxtitle">${t}</h2>
          <p class="boxtitle" style="font-size: 10px; font-weight: bold">${y}</p>
          <p class="boxtitle id" style="font-size: 7px; font-weight: bold; color: #FAC213">${id}</p>
        </div>
      </div>`
    }
    isSearch = true;
    console.log(data.Search);
  });
}

$("#back2").click(function () {
  var myMovieDivs = document.getElementById("main2");
  myMovieDivs.innerHTML = "";
  if(1 === count--) stack.pop();
  if(stack.length===0){
    $("h1").slideDown();
    $("#main").slideDown();
    $("#back2").slideUp();
    $("#info").slideUp();
    isSearch = false;
  }
  else displayAllMovies(stack.pop());
});
