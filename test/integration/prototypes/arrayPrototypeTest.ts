/*
 * rollup-plugin-sandbox - A Rollup plugin for isolating scripts.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/rollup-plugin-sandbox/
 *
 * Released under the MIT license
 * https://github.com/asmblah/rollup-plugin-sandbox/raw/main/MIT-LICENSE.txt
 */

// import { expect } from 'chai';
// import plugin from '../../../dist/plugin';
// import { rollup } from 'rollup';

describe.skip('Array.prototype isolation', () => {
    it('modifying Array.prototype should not affect the main window', async () => {
        // const bundle = await rollup({
        //     input: import.meta.resolve('./fixtures/arrayPrototypeEntry.ts'),
        //     plugins: [plugin()],
        // });
    });
});
