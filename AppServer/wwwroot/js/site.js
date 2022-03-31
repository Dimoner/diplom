const serviceController = (method,url) => {
    return Promise.race([
        fetch(url,{
            method,
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        })
            .then((res) => res.json())
        ,
        new Promise((_,reject) =>
            setTimeout(() => reject(new Error('Timeout')),10000)
        ),
    ]);
}

const searchUrl = (sortName,sortValue) => {
    const searchPath = document.location.search;
    const searchParams = new URLSearchParams(searchPath);
    searchParams.set(sortName,sortValue)
    return searchParams.toString();
}
