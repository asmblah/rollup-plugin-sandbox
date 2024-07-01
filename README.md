# rollup-plugin-sandbox

[![Build Status](https://github.com/asmblah/rollup-plugin-sandbox/workflows/CI/badge.svg)](https://github.com/asmblah/rollup-plugin-sandbox/actions?query=workflow%3ACI)

[EXPERIMENTAL] A [Rollup][Rollup] plugin for isolating scripts using [Quarantiner][Quarantiner].

## Usage

```shell
$ npm i --save-dev rollup-plugin-sandbox
```

`rollup.config.mjs`
```javascript
import sandbox from 'rollup-plugin-sandbox';
// ...

export default [
    {
        input: '.../input.ts',
        output: {
            // ...
        },
        plugins: [
            ...

            sandbox({
                globals: {
                    'myGlobal': {
                        type: 'function'
                    }
                }
            })
        ],
    }
];

```

[Quarantiner]: https://github.com/asmblah/quarantiner
[Rollup]: https://rollupjs.org/
