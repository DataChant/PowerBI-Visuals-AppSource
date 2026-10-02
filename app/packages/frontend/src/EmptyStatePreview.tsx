//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

import { Welcome } from './Welcome';

/**
 * The placeholder view `App.tsx` starts on. It is a thin wrapper over
 * `Welcome` so the usual replacement seam stays stable: replace
 * `<EmptyStatePreview />` in `App.tsx` with your own view.
 * See README.md for removing the welcome's tests and Vite plugin together.
 */
export function EmptyStatePreview() {
  return <Welcome />;
}
