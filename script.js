//our namespace
const app = {};

//all books api
app.generateListURL = 'https://api.nytimes.com/svc/books/v3/lists/names'; //get book genres
app.specificBookISBN = 'https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json' //get book information using isbn number
app.loadBooks = 'https://api.nytimes.com/svc/books/v3/lists.json'; //load books using genre
app.apiKey = 'VGnDGaD8A3qh1qSrqo0ppSGLHoMcom3T'; //our api key


//loading animation selector
app.loadingAnimation = document.querySelector('.loadingAnimation');

//array to hold specific amazon urls for the books that are displayed
app.amazonLinksArray = [];

//function used to populate the select option 
app.populateGenreOptions = function () {
    const populateUrl = new URL('https://proxy.hackeryou.com'); //proxy url for cors is necessary 
    populateUrl.search = new URLSearchParams({
        reqUrl: app.generateListURL,
        'params[api-key]': app.apiKey //api key

    });

    //api call to populate genre section
    fetch(populateUrl)
        .then(response => {
            if (response.ok) { //if response okay continue
                return response.json()
            } else { //if response is not good restart init
                setTimeout(() => {
                    app.init();
                }, 5000); //5 second wait
            }

        })
        .then(data => {
            const sortedArray = []; //array that will be used to sort our returns

            data['results'].forEach((value) => {
                sortedArray.push(value.list_name); //push fetched names to the array
            });
            sortedArray.sort(); //sort the array

            sortedArray.forEach((value) => { //loop through array and push the values into select 
                const option = document.createElement('option'); //create option
                option.value = value; //change value and text with content inside the array
                option.textContent = value;
                document.querySelector('#genre').append(option); //append the option
            });

        });
}

app.searchByISBN = function (isbn, id) {
    const isbnURL = new URL('https://proxy.hackeryou.com'); //proxy url for cors is necessary 
    isbnURL.search = new URLSearchParams({
        reqUrl: app.specificBookISBN,
        'params[isbn]': isbn,
        'params[api-key]': app.apiKey //api key

    });

    //api call to populate the modal
    const search = function () { //function used to run the fetch inside the main function call so that if the fetch fails we can recall this function so far we are only failing when the proxy server fails, possible endless loop situation if fetch starts calling for something that will never return data

        app.loadingAnimation.style.display = 'flex'; //display loading animation by returning to flex
        fetch(isbnURL)
            .then(response => {
                if (response.ok) { //if data is returned continue
                    return response.json()
                } else { //recall the search function doing everything over until we get data
                    setTimeout(() => {
                        search();
                    }, 2000); //wait 2 seconds

                }
            })
            .then(data => {

                const div = document.createElement('div'); //create div 
                div.classList.add('modal'); //add class of modal


                //div inner content is replaced with the necessary information from the api return to create the modal
                div.innerHTML = `<div class="modalScroll"><div class='innerContent'>
            <button class="closeModal" onclick="app.closeModal(this)">&#10006</button>
            <p class='title'>${data['results'][0].title}</p>
            <img src="https://covers.openlibrary.org/b/ISBN/${data['results'][0]['isbns'][0].isbn10}-L.jpg" alt="The book cover for ${data['results'][0].title} by ${data['results'][0].author}">
            <ul>
                <li>Author: ${data['results'][0].author}</li>
                <li>Publisher: ${data['results'][0].publisher}</li>
            </ul>

            <hr>

            <p>${data['results'][0].description}</p>


            ${data['results'][0]['reviews'][0]['book_review_link'] === "" ? "" : `<p class='bookReviewName'> <a href="${data['results'][0]['reviews'][0]['book_review_link']}" target="_blank">Click Here For Review</a>`}

            <p class="amazonButton"><a href ="${app.amazonLinksArray[id]}" target="_blank"><img class="amazonPurchaseButton"src="https://mikapak.com/wp-content/uploads/2019/04/amazon-buy-now-button-1024x506-768x380.png" alt="Purchase Image for Amazon"></a></p>
            


        </div>
        </div>`;
                //append the div
                document.querySelector('body').append(div);
                app.loadingAnimation.style.display = 'none';  //remove loading animation
            });

    }
    search();
}

app.searchBooks = function (genre) {
    app.loadingAnimation.style.display = 'flex';
    const populateUrl = new URL('https://proxy.hackeryou.com'); //proxy url for cors is necessary 
    populateUrl.search = new URLSearchParams({
        reqUrl: app.loadBooks,
        'params[list]': genre,
        'params[api-key]': app.apiKey //api key

    });
    //api call to populate the main page
    fetch(populateUrl)
        .then(response => {
            if (response.ok) {
                return response.json()
            }
        })
        .then(data => {

            data['results'].forEach((value, index) => {
                const imgEl = document.createElement('li');
                const image = document.createElement('img'); //used to check if image has successfully loaded

                let isISBNWorking; //holds a boolean value

                try {
                    if (value['isbns'][0].isbn10) { //if an error does not occur then this is working
                        isISBNWorking = true; //is true
                    }
                } catch {   //if an error did occur
                    isISBNWorking = false; //this is not working 
                }

                if (isISBNWorking) { //if isISBNWorking is not true that means an isbn10 number does not exist in this object 
                    image.src = `https://covers.openlibrary.org/b/ISBN/${value['isbns'][0].isbn10}-L.jpg?default=false`
                    app.amazonLinksArray.push(value.amazon_product_url);

                    imgEl.innerHTML = `<p>${value['book_details'][0].title}</p>
                    <button class="buttonStyle" onclick="app.displayModal(this)" id=${index}><img id = "${value['isbns'][0].isbn10}" src="https://covers.openlibrary.org/b/ISBN/${value['isbns'][0].isbn10}-L.jpg" alt="The book cover for ${value['book_details'][0].title} ${value['book_details'][0].author !== '' ? `by ${value['book_details'][0].author}.` : ""}"></button>`
                    document.querySelector('.bookDisplay').append(imgEl);


                }

            })

            app.loadingAnimation.style.display = 'none'; //remove loading animation
        });

}

//add event listeners
app.addEventListeners = function () {
    document.querySelector('input[type=submit').addEventListener('click', (event) => { //on submit
        document.querySelector('ul').innerHTML = ""; //clear screen 

        event.preventDefault(); //stop reload of page

        app.amazonLinksArray.splice(0, app.amazonLinksArray.length);


        const genre = document.querySelector('#genre').value; //get the current genre
        app.searchBooks(genre); //call the api with the genre and display the books
    });
    addEventListener('click', (event) => {
        if (event.target.className === 'modal') {
            event.target.style.display = 'none';
        }
    })


}
//function used to close the modal by changing its style
app.closeModal = function (event) {
    event.parentNode.parentNode.parentNode.style.display = `none`;
}

//function used too call the search byISBN function which will eventually lead to displaying modal pop-up
app.displayModal = function (event) {
    app.searchByISBN(event.childNodes[0].id, event.id); //call the search specific book api and pass the image id and the button id which will be used in the api call

}


// Back to top based on this https://www.w3schools.com/howto/howto_js_scroll_to_top.asp
app.mybutton = document.getElementById("myBtn"); //button that is used for going back to top of page


window.onscroll = function () { app.scrollFunction() }; //run this function on window scroll so when the user scrolls

app.scrollFunction = function () {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) { // When the user scrolls down 20px from the top of the document display the button
        app.mybutton.style.display = "block";
    } else { //or hide the button
        app.mybutton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
app.topFunction = function () {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}



//init function
app.init = function () {
    app.populateGenreOptions();
    app.addEventListeners();
    app.loadingAnimation.style.display = 'none';


    setTimeout(() => { //wait 1 second for everything above to run first
        app.searchBooks('Combined Print and E-Book Fiction'); //default run on first load
    }, 1000);

}


//call init function
app.init();