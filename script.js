//all books api
const generateListURL = 'https://api.nytimes.com/svc/books/v3/lists/names'; //get book genres
const specificBookISBN = 'https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json' //get book information using isbn number
const loadBooks = 'https://api.nytimes.com/svc/books/v3/lists.json'; //load books using genre

//cover picture needs key value and size
const picture = 'http://covers.openlibrary.org/b/$key/$value-$size.jpg'

//our namespace
const app = {}

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
            return response.json()
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

app.searchByISBN = function (isbn) {
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
            <img src="https://covers.openlibrary.org/b/ISBN/${data['results'][0]['isbns'][0].isbn10}-L.jpg" alt="The book cover for ${data['results'][0].title}">
            <ul>
                <li>Author: ${data['results'][0].author}</li>
                <li>Publisher: ${data['results'][0].publisher}</li>
            </ul>

            <hr>

            <p>${data['results'][0].description}</p>


            ${data['results'][0]['reviews'][0]['book_review_link'] === "" ? "" : `<p class='bookReviewName'>Book Review:</p><p class='bookReviewName'> <a href="${data['results'][0]['reviews'][0]['book_review_link']}">Review Link</a>`}
            


        </div>
        </div>`;

            document.querySelector('body').append(div);

        });

}

app.searchBooks = function (genre) {
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
            data['results'].forEach(value => {
                const imgEl = document.createElement('li');
                const image = document.createElement('img'); //used to check if image has successfully loaded
                image.src = `https://covers.openlibrary.org/b/ISBN/${value['isbns'][0].isbn10}-L.jpg?default=false`

                image.onload = function () { //on a successful load of image run this function

                    imgEl.innerHTML = `<p>${value['book_details'][0].title}</p>
                    <button class="buttonStyle" onclick="app.displayModal(this)"><img id = "${value['isbns'][0].isbn10}" src="https://covers.openlibrary.org/b/ISBN/${value['isbns'][0].isbn10}-L.jpg" alt=""></button>`
                    document.querySelector('.bookDisplay').append(imgEl);
                }


            })


        });

}

//add event listeners
app.addEventListeners = function () {
    document.querySelector('input[type=submit').addEventListener('click', (event) => {
        document.querySelector('ul').innerHTML = ""; //clear screen 

        event.preventDefault();
        const genre = document.querySelector('#genre').value;
        app.searchBooks(genre);
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
    app.searchByISBN(event.childNodes[0].id);

}
//init function
app.init = function () {
    app.populateGenreOptions();
    app.addEventListeners();
    setTimeout(() => {
        app.searchBooks('Combined Print and E-Book Fiction');
    }, 1000);

}

//call init function
app.init();