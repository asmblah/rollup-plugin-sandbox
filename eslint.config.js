/*
 * rollup-plugin-sandbox - A Rollup plugin for isolating scripts.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/rollup-plugin-sandbox/
 *
 * Released under the MIT license
 * https://github.com/asmblah/rollup-plugin-sandbox/raw/main/MIT-LICENSE.txt
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
module.exports = require('buildbelt/eslint.config').map((config) =>
    Object.assign(config, {
        files: [
            '{src,test}/**/*.{js,jsx,mjs,mts,ts,tsx}',
            '*.{js,jsx,mjs,mts,ts,tsx}',
        ],
    }),
);
