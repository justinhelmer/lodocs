![lodash](http://justinhelmer.github.io/lodash.github.io/images/logo.png)

------

[![npm package](https://badge.fury.io/js/lodocs.svg)](https://www.npmjs.com/package/lodocs)
[![node version](https://img.shields.io/node/v/lodocs.svg?style=flat)](http://nodejs.org/download/)
[![dependency status](https://david-dm.org/justinhelmer/lodocs.svg)](https://github.com/justinhelmer/lodocs)
[![devDependency status](https://david-dm.org/justinhelmer/lodocs/dev-status.svg)](https://github.com/justinhelmer/lodocs#info=devDependencies)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/justinhelmer/lodocs/issues)

`CLI` for managing [lodash.github.io](http://justinhelmer.github.io/lodash.github.io/).

Commands should be run from the root directory of the main project.

Not intended to be used independently.

## Installation

This interface should be installed _locally_, as it is a [dependency](https://github.com/justinhelmer/lodash.github.io/blob/master/package.json) of the main [site repo](https://github.com/justinhelmer/lodash.github.io/). It is intended **specifically** for managing the `Lodash` website. The only reason to clone this repo specificially would be for making changes to the `CLI`. It currently remains separate for modularity and maintenance purposes.

```bash
$ npm install --save lodocs
```

## Usage

Because this repository isn't useful without it's [sibling](https://github.com/justinhelmer/lodash.github.io/), it may be useful to [npm link](https://docs.npmjs.com/cli/link) the local copy of `lodocs` for use with the local copy of `lodash.github.io`.

To do so, from the root of **this** repository, run:

```bash
$ npm link
```

This will link the local library/bin for `lodocs` to the global `node` library/bin location.

Next, switch over to the local [lodash.github.io](https://github.com/justinhelmer/lodash.github.io/) repository, and run:

```bash
$ npm link lodocs
```

Now, when running the `lodocs` command from the root of the `lodash.github.io` repo, it will be pointing to the the commands located in the local `lodocs` repo.

## Sub-commands

### lodocs-build(1)

### lodocs-serve(1)

## Contributing

[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/justinhelmer/lodocs/issues)

See [usage](#usage) on information of how to optimize your development workflow.

## License

The MIT License (MIT)

Copyright (c) 2016 Justin Helmer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

