"use client";
import PlayMatch from "@/app/component/application/matchesList";
import { add_match } from "@/routes/websiteRoute";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PlayMatchPage() {
  const searchParams = useSearchParams();
  const matchType = searchParams.get("type");
  return (
    <>
      <div className="w-full p-0 m-0 flex flex-col bg-black">
        <Link
          href={`${add_match}/?type=${matchType}`}
          className="w-full text-center rounded-xl py-3 my-2 mx-auto text-xl text-white bg-[#5c5ca9]
   
  "
        >
          + Create New Match
        </Link>
      </div>
      <PlayMatch type={matchType} />
    </>
  );
}
