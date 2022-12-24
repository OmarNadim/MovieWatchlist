// THE GLOBAL VALUES

let listOfMoviesFound = [] //The list of movies found when a user searches for a title (cleaned from duplicates and N/A data)

let watchlistMovies = [] // The list of movies added to the watch list by the user

/***************************************/

//DOM MANIPULATION DECLARATIONS
const title = document.getElementById("search-input") // The input to insert the title the user is searching for
const search = document.getElementById("search-btn") // The search button

const main = document.getElementById("main") // Where the search result is gonna be displayed
const form = document.getElementById("form") // The form containing the input text and button

search.addEventListener("click", moviesSearchRendering) // the event listener for searching


async function moviesSearchRendering(){
    let response = await fetch(`https://www.omdbapi.com/?s=${title.value}&apikey=92dc96f3`)
    let data = await response.json()
    let movieHtml = ""
    
    let movies = data.Search.reduce(function (acc, currentValue) {
                if(acc.map(a=>a.Title).indexOf(currentValue.Title) === -1){
                    acc.push(currentValue)
                }
                return acc
            }, []).filter(search=>search.Type==="movie").filter(search=>!Object.values(search).includes("N/A"))
    
    for (let movie of movies){
        const inputValue = movie.Title.replace(" ","+");
        response = await fetch("https://www.omdbapi.com/?t="+inputValue+"&apikey=92dc96f3")
        data = await response.json()
        
        const movieObj = {
            title: data.Title,
            duration: data.Runtime,
            plot: data.Plot,
            rating: data.imdbRating,
            genre: data.Genre,
            image: data.Poster,
            id: data.imdbID   
        }
        
        listOfMoviesFound.push(movieObj)
          
        movieHtml += `
        <div class="wrapper">
            <div class="movie">
                <div class="poster">
                    <img src=${movieObj.image}>
                </div>
                <div class="info">
                    <div class="title-rating">
                        <p class="title">${movieObj.title}</p>
                        <p class="rating">&#x2B50 ${movieObj.rating}</p>
                    </div>
                    <div class="duration-genre-wl">
                        <p class="duration">${movieObj.duration}</p>
                        <p class="genre">${movieObj.genre}</p>
                        <div class="add-to-watchlist">
                            <img id="${movieObj.id}" class="add" src="img/plus.png">
                            <p class="wl">Watchlist</p>
                        </div>
                    </div>
                    <p class="plot">${movieObj.plot}</p>
                </div>
            </div>
            <div class="separator"></div>
        </div>`
    }
    
    main.innerHTML = movieHtml  
    
    for(let element of document.getElementsByClassName("add")){
        element.addEventListener("click", addToWatchlist)
    }
    
}

const watchlist = document.getElementById("watchlist")

watchlist.addEventListener("click",()=>{
    if(document.getElementById("watchlist").textContent === "My Watchlist"){
        document.getElementById("find").textContent = "My Watchlist";
        document.getElementById("watchlist").textContent = "Search for movies"
        form.style.display = "none"
        watchlistRendering()
    }else{
        document.getElementById("find").textContent = "Find your film";
        document.getElementById("watchlist").textContent = "My Watchlist";
        form.style.display = "flex"
        main.innerHTML = ""
    }
})

function addToWatchlist(e){
    for(let movie of listOfMoviesFound){
        if(e.target.id === movie.id){
            watchlistMovies.push(movie)
        }  
    }
    console.log(watchlistMovies)
}

function watchlistRendering(){
    let watchlistHtml = "";
    for(let movie of watchlistMovies){
        watchlistHtml += `
            <div class="wrapper">
                <div class="movie">
                    <div class="poster">
                        <img src=${movie.image}>
                    </div>
                    <div class="info">
                        <div class="title-rating">
                            <p class="title">${movie.title}</p>
                            <p class="rating">&#x2B50 ${movie.rating}</p>
                        </div>
                        <div class="duration-genre-wl">
                            <p class="duration">${movie.duration}</p>
                            <p class="genre">${movie.genre}</p>
                            <div class="add-to-watchlist">
                                <img id="${movie.id}" class="add" src="img/plus.png">
                                <p class="wl">Watchlist</p>
                            </div>
                        </div>
                        <p class="plot">${movie.plot}</p>
                    </div>
                </div>
                <div class="separator"></div>
            </div>`   
    }
    main.innerHTML = watchlistHtml
}




