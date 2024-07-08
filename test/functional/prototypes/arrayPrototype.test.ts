/*
 * rollup-plugin-sandbox - A Rollup plugin for isolating scripts.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/rollup-plugin-sandbox/
 *
 * Released under the MIT license
 * https://github.com/asmblah/rollup-plugin-sandbox/raw/main/MIT-LICENSE.txt
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { firefox } from 'playwright';
import plugin from '../../../src/plugin';
import { readFileSync } from 'node:fs';
import { rollup, RollupBuild } from 'rollup';
import { PageFunction } from 'playwright-core/types/structs';
import { Browser, Page } from 'playwright-core/types/types';
import Sandbox from 'quarantiner/dist/Sandbox/Sandbox';

type ModifiedArray = typeof Array & {
    prototype: typeof Array.prototype & { myValue: unknown };
};
type ModifiedWindow = typeof window & {
    bundleLoaded: true;
    quarantiner: {
        getSandbox: typeof import('quarantiner').getSandbox;
    };
    sandbox: Sandbox;
};

describe('Array.prototype isolation', () => {
    let browser: Browser;
    let page: Page;

    beforeEach(async () => {
        browser = await firefox.launch();
        page = await browser.newPage();

        const bundle: RollupBuild = await rollup({
            input: import.meta.dirname + '/fixtures/arrayPrototypeEntry.js',
            plugins: [plugin()],
        });

        const { output } = await bundle.generate({
            format: 'umd',
            name: 'myModule',
        });
        const chunk = output[0];

        const quarantinerCode = readFileSync(
            import.meta.dirname +
                '/../../../node_modules/quarantiner/dist/quarantiner.umd.js',
        ).toString();

        // Load Quarantiner library.
        await page.evaluate(
            new Function(quarantinerCode) as PageFunction<void, unknown>,
        );

        // Load the bundle we built with Rollup using this plugin above.
        await page.evaluate(
            `
            const script = document.createElement('script');
            script.src = ${JSON.stringify('data:application/javascript;base64,' + btoa(chunk.code))};
            script.onload = () => {
                window.bundleLoaded = true;
            };
            document.body.appendChild(script);
            `,
        );
        await page.waitForFunction(
            () => (window as ModifiedWindow).bundleLoaded,
        );

        // Wait for the sandbox to be ready and the bundle to execute inside.
        await page.evaluate(() => {
            (window as ModifiedWindow).quarantiner
                .getSandbox()
                .then((sandbox: Sandbox) => {
                    (window as ModifiedWindow).sandbox = sandbox;
                });
        });
        await page.waitForFunction(() =>
            Boolean((window as ModifiedWindow).sandbox),
        );
    });

    afterEach(async () => {
        await browser.close();
    });

    it('modifying Array.prototype should not affect the main window', async () => {
        const mainWindowGlobal = await page.evaluate(
            () =>
                ((window as ModifiedWindow).Array as ModifiedArray).prototype
                    .myValue,
        );
        const sandboxWindowGlobal = await page.evaluate(
            () =>
                (
                    (window as ModifiedWindow).sandbox.getGlobal(
                        'Array',
                    ) as ModifiedArray
                ).prototype.myValue,
        );

        expect(mainWindowGlobal).to.be.undefined;
        expect(sandboxWindowGlobal).to.equal('my value');
    });
});
