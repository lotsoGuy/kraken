import Link from "next/link";


export default async function  Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
     <h1>Welcome to Auth App</h1>
        <Link className={"text-blue-500 underline"} href={'dashboard'}>
            Go to Dashboard
        </Link>
    </main>
  );
}
