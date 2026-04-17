"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  MatchType1,
  MatchType2,
  MatchType3,
  MatchType4,
  MatchType5,
  MatchType6,
  MatchType7,
  MatchType8,
  MatchType9,
  MatchType10,
  MatchType1Img,
  MatchType2Img,
  MatchType3Img,
  MatchType4Img,
  MatchType5Img,
  MatchType6Img,
  MatchType7Img,
  MatchType8Img,
  MatchType9Img,
  MatchType10Img,
} from "@/config";

const matches = [
  {
    title: MatchType1,
    link: `/match-results/index/?type=${MatchType1}`,
    image: MatchType1Img,
  },
  {
    title: MatchType2,
    link: `/match-results/index/?type=${MatchType2}`,
    image: MatchType2Img,
  },
  {
    title: MatchType3,
    link: `/match-results/index/?type=${MatchType3}`,
    image: MatchType3Img,
  },
  {
    title: MatchType4,
    link: `/match-results/index/?type=${MatchType4}`,
    image: MatchType4Img,
  },
  {
    title: MatchType5,
    link: `/match-results/index/?type=${MatchType5}`,
    image: MatchType5Img,
  },
  {
    title: MatchType6,
    link: `/match-results/index/?type=${MatchType6}`,
    image: MatchType6Img,
  },
  {
    title: MatchType7,
    link: `/match-results/index/?type=${MatchType7}`,
    image: MatchType7Img,
  },
  {
    title: MatchType8,
    link: `/match-results/index/?type=${MatchType8}`,
    image: MatchType8Img,
  },
  {
    title: MatchType9,
    link: `/match-results/index/?type=${MatchType9}`,
    image: MatchType9Img,
  },
  {
    title: MatchType10,
    link: `/match-results/index/?type=${MatchType10}`,
    image: MatchType10Img,
  },
];

export default function MatchCards() {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">All Matches Results</h2>
      <div className="grid grid-cols-2 gap-4">
        {matches.map((match, index) => (
          <Card
            key={index}
            className="cursor-pointer hover:shadow-lg transition-shadow pt-0"
          >
            <Link href={match.link}>
              <CardHeader className="p-0">
                <div className="relative w-full h-32">
                  <Image
                    src={match.image}
                    alt={match.title}
                    fill
                    className="object-fill rounded-t-lg"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-md font-bold">
                  {match.title}
                </CardTitle>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
