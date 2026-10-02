//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

/**
 * The app's Rayfin data schema registration.
 *
 * Empty on purpose. A dashboard over a Power BI semantic model stores nothing,
 * so the data service ships disabled in `rayfin/rayfin.yml` and both of these
 * stay as they are.
 *
 * When the app needs to own records — a tracker, a request list, an admin screen
 * — read the `data-modeling` skill, set `services.data.enabled: true`, declare
 * each entity as a decorated class, export it from this package, add it to
 * `UniversalAppSchema`, and register it in `schema`. Every entity needs explicit
 * access control; anonymous access is refused at validation time.
 */
export type { UniversalAppSchema } from '@rayfin-app/shared';

export const schema = [];
