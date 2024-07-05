/*
 * rollup-plugin-sandbox - A Rollup plugin for isolating scripts.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/rollup-plugin-sandbox/
 *
 * Released under the MIT license
 * https://github.com/asmblah/rollup-plugin-sandbox/raw/main/MIT-LICENSE.txt
 */

import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import rollupPluginPeerDepsExternalModule from 'rollup-plugin-peer-deps-external';
import typescript from '@rollup/plugin-typescript';
import { Plugin } from 'rollup';

export default defineConfig(({ mode }) => ({
    build: {
        lib: {
            entry: resolve('./src/plugin.ts'),
            fileName: 'plugin',
            formats: ['es'],
        },
        minify: mode === 'development' ? false : 'terser',
        rollupOptions: {
            plugins: [
                // Consuming app should require peer dependencies such as `magic-string`.
                rollupPluginPeerDepsExternalModule() as Plugin,

                typescript(),
            ],
        },
        sourcemap: true,
    },

    test: {
        workspace: 'vitest.workspace.mts',
    },
}));
