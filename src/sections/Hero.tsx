import Link from "next/link";

export default function Hero() {
    return (
        <>
         <div className="flex items-center justify-center h-full w-full">
            <Link href={"/sign-in"} className="px-2 py-1 rounded-lg">
              Start now
            </Link>
         </div>
        </>
    )
}