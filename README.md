# routine


#### INSTALL
```
$ sudo npm i
```
#### BUILD
```
$ node compile/compile.js pages/home.json
```
#### LOCAL SERVER
```
$ npm start
```

[http://localhost:8000/pages/home.html](http://localhost:8000/pages/home.html)

##### FOLDER STRUCTURING
```
// main folder for all components
blocks
  ↳ header    // header block folder

    ↳ __logo  // header logo element folder
      header__logo.less
      header__logo.js

      ↳ _right  // header logo element modifier folder
        header__logo_right.less
        header__logo_right.js

    ↳ _inverse  // header block modifier folder
      header_inverse.less
      header_inverse.js

    header.less
    header.js

// main folder for all blocks custom styles/mixings/overlays
blocks.themes
  ↳ header    // header block folder

    ↳ __logo  // header logo element folder
      header__logo.less
      header__logo.js

      ↳ _right  // header logo element modifier folder
        header__logo_right.less
        header__logo_right.js

    ↳ _inverse  // header block modifier folder
        header_inverse.less
        header_inverse.js

  header.less
  header.js

```
