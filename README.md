# google-translate-api

A free proxy from the google translate api that avoids the limit of requests that google imposes.

## Why use a proxy

It is necessary because a free Google Translate API generates a hash value for each query (string you want to translate) that you do.
The hash is located
in the tk parameter of url query. You can see it in the devTools of the browser on the GET request parameters.
The hash is generated by a window variable TKK and the query in a function like: tk_hash(query, TKK)). To see how it works, check the [hash-code.js](https://github.com/aleksandersousa/google-translate-api-nodejs/blob/master/src/util/tk-hash.js) file.

## How it works

The api use selenium to scrape the window variable TKK to generate the hash code and use jsdom to render the html of the source page of a GET request  made by selenium on the browser that returns a json object and scrape this.

## Setup

Make sure you have npm properly installed.

Follow the instructions to use the server:

  1. git clone or download the zip file <https://github.com/aleksandersousa/google-translate-api-nodejs.git>
  2. in the root of the folder, install the dependencies of the package.json typing npm install 'dependencie name'.
  3. type npm run babel for start the server.
  4. to perform tests, install the dev dependencies do package.json and with the server running, type npm test.

## Usage

The server runs on localhost on port 5000.

**NOTE: Only GET requests are supported.**

**NOTE2: The limit of the text parameter are 7400 characters.**

A example of valid url is: ```https://localhost:5000/api/v1/translation?sourceLang=en&targetLang=pt&text=test```

**_- The query string must to be like this:_**

    {
        "sourceLang": "en"
        "targetLang": "pt"
        "text": "test"
    }

 You may use sourceLang: "auto" to let google choose for you.

**_OUTPUT:_**

    {
        "translation":  "teste",
        "synonyms": [
            "teste", "ensaio", "prova", "exame", "análise",
            "experiência", "vocação", "padrão", "bitola", "craveira",
            "pedra-de-toque"
        ], //synonyms only avaible for shorter querys
        "originalResponse": [] //google original json response is an nested array too big to put here.
    }

**- WARNING: _parallel requests cannot be made because it's necessary to wait for selenium load the page to jsdom scrape the json file. Wait to the request finish for the correct result._**
