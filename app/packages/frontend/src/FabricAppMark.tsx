//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

import { useId } from 'react';

// The shared Fabric Apps logomark, drawn inline without an external asset.
export function FabricAppMark() {
  const id = useId();
  return (
    <svg
      viewBox="0 0 112 112"
      fill="none"
      aria-hidden="true"
      className="fabric-app-mark"
    >
      <path
        d="M36.134 105.002L1.337 55.2999C0.494667 54.0935 0 52.6259 0 51.0439C0 46.9395 3.32733 43.6099 7.434 43.6099H51.5363L49.56 100.602C49.56 104.706 46.2327 108.036 42.126 108.036C39.6667 108.036 37.4873 106.841 36.134 105.002Z"
        fill={`url(#${id}-blue)`}
      />
      <path
        d="M43.4348 80.8662C44.7765 82.8099 47.0188 84.0815 49.5575 84.0815C53.6618 84.0815 56.9915 80.7542 56.9915 76.6475V23.7882H17.7565C13.6522 23.7882 10.3225 27.1155 10.3225 31.2222C10.3225 32.8042 10.8172 34.2719 11.6595 35.4782L43.4348 80.8662Z"
        fill={`url(#${id}-cyan)`}
      />
      <path
        d="M49.5575 84.0816C47.0188 84.0816 44.7765 82.8076 43.4348 80.8662C43.4348 80.8662 28.4642 59.4812 19.0725 46.0669V23.7859H56.9892V76.6476C56.9892 80.7542 53.6642 84.0816 49.5575 84.0816Z"
        fill={`url(#${id}-shade)`}
      />
      <path
        d="M110.621 15.7102C111.489 14.4946 112 13.0059 112 11.3982C112 7.2939 108.673 3.96423 104.566 3.96423H56.9917C52.8873 3.96423 49.5577 7.29157 49.5577 11.3982V100.602C49.5577 102.249 49.021 103.77 48.1157 105.002L110.621 15.7102Z"
        fill={`url(#${id}-teal)`}
      />
      <path
        d="M110.621 15.7102C111.489 14.4946 112 13.0059 112 11.3982C112 7.2939 108.673 3.96423 104.566 3.96423H56.9917C52.8873 3.96423 49.5577 7.29157 49.5577 11.3982V100.602C49.5577 102.249 49.021 103.77 48.1157 105.002L110.621 15.7102Z"
        fill={`url(#${id}-green)`}
      />
      <defs>
        <linearGradient
          id={`${id}-blue`}
          x1="3.66355"
          y1="50.7663"
          x2="37.1001"
          y2="111.795"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0067BF" />
          <stop offset=".514919" stopColor="#004695" />
          <stop offset="1" stopColor="#163697" />
        </linearGradient>
        <linearGradient
          id={`${id}-cyan`}
          x1="10.3225"
          y1="29.8317"
          x2="61.3504"
          y2="89.3646"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#26CFE8" />
          <stop offset=".438656" stopColor="#0094F0" />
          <stop offset="1" stopColor="#0067BF" />
        </linearGradient>
        <linearGradient
          id={`${id}-shade`}
          x1="19.0748"
          y1="53.9349"
          x2="56.9915"
          y2="53.9349"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".269" stopOpacity="0" />
          <stop offset=".928" stopOpacity=".154" />
          <stop offset="1" stopOpacity=".2" />
        </linearGradient>
        <linearGradient
          id={`${id}-teal`}
          x1="80.0578"
          y1="76.4111"
          x2="23.5945"
          y2="4.23913"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#16BFDF" />
          <stop offset="1" stopColor="#3EE5C9" />
        </linearGradient>
        <linearGradient
          id={`${id}-green`}
          x1="80.0578"
          y1="54.4832"
          x2="36.3496"
          y2="9.2845"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3EE5C9" stopOpacity="0" />
          <stop offset="1" stopColor="#9BF3AF" />
        </linearGradient>
      </defs>
    </svg>
  );
}
