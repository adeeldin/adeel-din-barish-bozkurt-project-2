

//all books api
const generateListURL = 'https://api.nytimes.com/svc/books/v3/lists/names'; //get book genres
const specificBookISBN = 'https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json' //get book information using isbn number
const loadBooks = 'https://api.nytimes.com/svc/books/v3/lists.json'; //load books using genre

//cover picture needs key value and size
const picture = 'http://covers.openlibrary.org/b/$key/$value-$size.jpg'

//our namespace
const app = {};


app.loadingAnimation = document.querySelector('.loadingAnimation');

//array to hold specific amazon urls for the books that are displayed
app.amazonLinksArray = [];

app.populateGenreOptions = function () {
    const populateUrl = new URL('https://proxy.hackeryou.com'); //proxy url for cors is necessary 
    populateUrl.search = new URLSearchParams({
        reqUrl: generateListURL,
        // 'params[list]': 'hardcover-fiction',
        'params[api-key]': 'VGnDGaD8A3qh1qSrqo0ppSGLHoMcom3T' //api key
        // 'proxyHeaders[Some-Header]': 'goes here',
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
            const sortedArray = [];

            data['results'].forEach((value) => {
                sortedArray.push(value.list_name);
            });
            sortedArray.sort();
            // console.log(sortedArray);

            sortedArray.forEach((value) => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                document.querySelector('#genre').append(option);
            });




        });
}

app.searchByISBN = function (isbn, id) {
    const isbnURL = new URL('https://proxy.hackeryou.com'); //proxy url for cors is necessary 
    isbnURL.search = new URLSearchParams({
        reqUrl: specificBookISBN,
        'params[isbn]': isbn,
        'params[api-key]': 'VGnDGaD8A3qh1qSrqo0ppSGLHoMcom3T' //api key
        // 'proxyHeaders[Some-Header]': 'goes here',
    });
    //api call to populate the modal
    fetch(isbnURL)
        .then(response => {
            return response.json()
        })
        .then(data => {
            // console.log(data);
            const div = document.createElement('div');
            div.classList.add('modal');



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

            document.querySelector('body').append(div);

        });

}

app.searchBooks = function (genre) {
    app.loadingAnimation.style.display = 'flex';
    const populateUrl = new URL('https://proxy.hackeryou.com'); //proxy url for cors is necessary 
    populateUrl.search = new URLSearchParams({
        reqUrl: loadBooks,
        'params[list]': genre,
        'params[api-key]': 'VGnDGaD8A3qh1qSrqo0ppSGLHoMcom3T' //api key
        // 'proxyHeaders[Some-Header]': 'goes here',
    });
    //api call to populate the main page
    fetch(populateUrl)
        .then(response => {
            if (response.ok) {
                return response.json()
            }
        })
        .then(data => {
            // console.log(data);
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



                    // image.addEventListener('error', function () {
                    //     imgEl.innerHTML = `<p>${value['book_details'][0].title}</p>
                    // <button class="buttonStyle" onclick="app.displayModal(this)" id=${index}><img id = "${value['isbns'][0].isbn10}" src="https://islandpress.org/sites/default/files/default_book_cover_2015.jpg" alt=""></button>`
                    //     document.querySelector('.bookDisplay').append(imgEl);
                    // }, true); //no idea what this true does


                    // console.log(value['book_details'][0].author)
                    imgEl.innerHTML = `<p>${value['book_details'][0].title}</p>
                    <button class="buttonStyle" onclick="app.displayModal(this)" id=${index}><img id = "${value['isbns'][0].isbn10}" src="https://covers.openlibrary.org/b/ISBN/${value['isbns'][0].isbn10}-L.jpg" alt="The book cover for ${value['book_details'][0].title} ${value['book_details'][0].author !== '' ? `by ${value['book_details'][0].author}.` : ""}"></button>`
                    document.querySelector('.bookDisplay').append(imgEl);


                }

            })

            app.loadingAnimation.style.display = 'none';
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
app.closeModal = function (event) {
    // console.log(`works`)
    // console.log(event.parentNode.parentNode)
    event.parentNode.parentNode.parentNode.style.display = `none`;
}
//display model pop-up on tab & click
app.displayModal = function (event) {
    app.searchByISBN(event.childNodes[0].id, event.id); //call the search specific book api and pass the image id and the button id which will be used in the api call

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