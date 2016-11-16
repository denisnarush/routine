# routine


#### INSTALL
```
$ sudo npm i
```
#### BUILD
```
$ node compile/compile.js pages/home.json
$ npm run build
```
#### LOCAL SERVER
```
$ npm run start
```

[http://localhost:8000/pages/home.html](http://localhost:8000/pages/home.html)

##### FOLDER STRUCTURING
```
// main folder for all components
blocks/
  ↳ header/      - header block
    header.less
    header.js

    ↳ __logo/      - header logo element
      header__logo.less
      header__logo.js

      ↳ _right/      - header logo element modifier
        header__logo_right.less
        header__logo_right.js

    ↳ _inverse/      - header block modifier
      header_inverse.less
      header_inverse.js

// main folder for all blocks custom styles/mixings/overlays
blocks.theme

// main folder for all pages configuration
pages/
  home.json

// page compiler
compile/
  compile.js
  
```