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

    });

