//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react({
      useAtYourOwnRisk_mutateSwcOptions(options) {
        options.jsc.parser.decorators = true;
        options.jsc.transform.decoratorVersion = '2022-03';
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
    globals: true,
    testTimeout: 15_000,
    /**
     * Only the app's own specs. The template also ships `scripts/*.test.mjs`,
     * which are run by `node --test` and are not vitest suites, so without
     * this `npm test` collects them and fails on "No test suite found".
     */
    include: ['src/**/*.spec.{ts,tsx}'],
    /**
     * `npm test` is part of the deployment gate, and an app that has not
     * written a spec yet is not a broken app. Without this, vitest exits
     * non-zero on "No test files found" and validation reports a failure the
     * builder cannot act on -- while a real failing spec still blocks, which
     * is the part that matters.
     */
    passWithNoTests: true,
  },
  resolve: {
    alias: { '@': resolve(import.meta.dirname, 'src') },
  },
});
