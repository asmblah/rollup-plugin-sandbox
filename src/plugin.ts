/*
 * rollup-plugin-sandbox - A Rollup plugin for isolating scripts.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/rollup-plugin-sandbox/
 *
 * Released under the MIT license
 * https://github.com/asmblah/rollup-plugin-sandbox/raw/main/MIT-LICENSE.txt
 */

import MagicString from 'magic-string';
import { SourceMapInput } from 'rollup';

type ConfigOptions = {
    globals: {
        [name: string]: {
            type: 'function' | 'object';
        };
    };
};

export default (configOptions: ConfigOptions = { globals: {} }) => {
    return {
        name: 'sandbox',
        renderChunk(code: string): { code: string; map: SourceMapInput } {
            const magicString = new MagicString(code);

            magicString
                .prepend(
                    'if (typeof quarantiner !== "undefined") {' +
                        'quarantiner.quarantine(function (parent, self, top, window) {with (self) {\n',
                )
                .append(
                    `}}, ${JSON.stringify({ globals: configOptions.globals ?? {} })});} ` +
                        `else { throw new Error("Quarantiner is not installed"); }`,
                );

            return {
                code: magicString.toString(),
                map: magicString.generateMap({ hires: true }),
            };
        },
    };
};
