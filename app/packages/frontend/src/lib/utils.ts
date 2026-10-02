//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// The design tokens in global.css name font sizes `text-100`..`text-hero-1000`.
// Out of the box tailwind-merge reads those as colours, so `text-300 text-foreground`
// silently lost its size. Registering the scale keeps size and colour apart.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        { text: ['100', '200', '300', '400', '500', '600', 'hero-700', 'hero-800', 'hero-900', 'hero-1000'] },
      ],
    },
  },
});

/**
 * Merge Tailwind CSS class names with conflict resolution.
 *
 *   cn("px-2 py-1", isActive && "bg-primary text-primary-foreground")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
