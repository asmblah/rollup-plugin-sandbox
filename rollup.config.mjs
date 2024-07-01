/*
 * rollup-plugin-sandbox - A Rollup plugin for isolating scripts.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/rollup-plugin-sandbox/
 *
 * Released under the MIT license
 * https://github.com/asmblah/rollup-plugin-sandbox/raw/main/MIT-LICENSE.txt
 */

import typescript from '@rollup/plugin-typescript';
import rollupPluginPeerDepsExternalModule from 'rollup-plugin-peer-deps-external';

export default [
    {
        input: 'src/plugin.ts',
        output: {
            file: 'dist/plugin.mjs',
            format: 'es',
            sourcemap: true,
        },
        plugins: [
            // Consuming app should require peer dependencies such as `magic-string`.
            rollupPluginPeerDepsExternalModule(),

            typescript({
                tsconfig: './tsconfig.json',
            })
        ],
    },
];
