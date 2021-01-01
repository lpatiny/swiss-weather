# swiss-weather

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

Proxy to the swiss weather prediction.

This will return a comma separated string:

- current temperature
- this hour rain
- this hour rain probability
- this hour pictogram

Followed by the 6 times slot of the day with the same information

## Installation

`$ npm i swiss-weather`

## Reference

https://developer.srgssr.ch/apis/srgssr-weather/docs

## Usage

```js
import library from 'swiss-weather';

const result = library(args);
// result is ...
```

## [API Documentation](https://lpatiny.github.io/swiss-weather/)

## License

[MIT](./LICENSE)
