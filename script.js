// music api
// const proxiedUrl = 'https://tastedive.com/api/similar';

// const url = new URL('http://proxy.hackeryou.com');
// url.search = new URLSearchParams({
//     reqUrl: proxiedUrl,
//     'params[q]': 'timber',
//     'params[type]': 'music',
//     'params[info]': '1',
//     'params[limit]': '10',
//     'params[k]': '415709-student-AR35QEJC'
//     // 'proxyHeaders[Some-Header]': 'goes here',
// });

// fetch(url)
//     .then(response => response.json())
//     .then(data => {
//         /* ... */
//         console.log(data);
//     });

//books api
const proxiedUrl = 'https://api.nytimes.com/svc/books/v3/lists/names';

const url = new URL('http://proxy.hackeryou.com');
url.search = new URLSearchParams({
    reqUrl: proxiedUrl,
    // 'params[list]': 'hardcover-fiction',
    'params[api-key]': 'VGnDGaD8A3qh1qSrqo0ppSGLHoMcom3T'
    // 'proxyHeaders[Some-Header]': 'goes here',
});

fetch(url)
    .then(response => response.json())
    .then(data => {
        /* ... */
        console.log(data);
        // document.querySelector('.myImage').src =
        //     `http://covers.openlibrary.org/b/ISBN/${data.results[1].isbns[0].isbn10}-L.jpg`
        // console.log(data.results[1]);

    });


        // const url = new URL('https://tastedive.com/api/similar');
        // url.search = new URLSearchParams({
        //     q: 'pitbull',
        //     type: 'music',
        //     info: '1',
        //     limit: '10',
        //     k: '415709-student-AR35QEJC'

        // });
        // fetch(url).then(function (response) {
        //     console.log(response);
        // });