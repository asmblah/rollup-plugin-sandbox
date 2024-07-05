/*
 * rollup-plugin-sandbox - A Rollup plugin for isolating scripts.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/rollup-plugin-sandbox/
 *
 * Released under the MIT license
 * https://github.com/asmblah/rollup-plugin-sandbox/raw/main/MIT-LICENSE.txt
 */

import { defineWorkspace } from 'vitest/config';
import { copyFileSync } from 'node:fs';

export default defineWorkspace([
    {
        extends: './vite.config.mts',
        plugins: [
            {
                name: 'import-quarantiner-umd-bundle-for-testing',
                closeBundle: (): void => {
                    copyFileSync(
                        import.meta.dirname +
                            '/node_modules/quarantiner/dist/quarantiner.umd.js',
                        import.meta.dirname + '/dist/quarantiner.umd.js',
                    );
                },
            },
        ],
        publicDir: './dist', // Make built assets available during tests.
        test: {
            name: 'browser',
            include: ['test/browser/**/*.test.ts'],
            browser: {
                enabled: true,
                name: 'firefox',
                provider: 'playwright',
            },
        },
    },
    {
        extends: './vite.config.mts',
        test: {
            name: 'node',
            include: ['test/{integrated,unit}/**/*.test.ts'],
        },
    },
]);
