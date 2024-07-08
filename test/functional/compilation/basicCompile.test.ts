/*
 * rollup-plugin-sandbox - A Rollup plugin for isolating scripts.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/rollup-plugin-sandbox/
 *
 * Released under the MIT license
 * https://github.com/asmblah/rollup-plugin-sandbox/raw/main/MIT-LICENSE.txt
 */

import { describe, expect, it } from 'vitest';
import plugin from '../../../src/plugin';
import { rollup, RollupBuild } from 'rollup';

describe('Basic compilation', () => {
    it('should correctly compile a simple entry script', async () => {
        const bundle: RollupBuild = await rollup({
            input: import.meta.dirname + '/fixtures/basicCompileEntry.js',
            plugins: [plugin()],
        });

        const { output } = await bundle.generate({
            format: 'umd',
            name: 'myModule',
        });
        const chunk = output[0];

        expect(chunk.type).to.equal('chunk');
        expect(chunk.code).to.equal(
            'if (typeof quarantiner !== "undefined") {quarantiner.quarantine(function (parent, self, top, window) {with (self) {\n' +
                '(function (factory) {\n' +
                "\ttypeof define === 'function' && define.amd ? define(factory) :\n" +
                '\tfactory();\n' +
                "})((function () { 'use strict';\n" +
                '\n' +
                "\twindow.myValue = 'my value';\n" +
                '\n' +
                '}));}}, {"globals":{}});} else { throw new Error("Quarantiner is not installed"); }\n',
        );
    });
});
