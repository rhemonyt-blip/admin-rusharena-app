import Image from "next/image";

export default function adminLayout({ children }) {
  return (
    <div className="w-full font-sans min-h-screen  flex flex-col items-center gap-16 pt-4">
      <main className="w-full  mt-16">
        <nav className="fixed top-0 left-0 right-0 min-h-[38px] bg-[#0A0020] flex justify-between py-3 px-6 shadow-[0_-1px_10px_rgba(0,0,0,0.4)] z-99">
          {/* Left side: Logo and company name */}
          <div className="flex items-center space-x-2">
            <Image
              src="/images/logo.jpg"
              alt="Logo"
              width={52}
              height={52}
              className="rounded-full"
            />
            <h1 className="font-semibold text-lg text-green-500">Rush Arena</h1>
          </div>

          {/* Right side: Profile section */}
          <div className="flex items-center ">
            <strong className="font-medium text-white"> Admin Panel </strong>
          </div>
        </nav>

        {children}
      </main>
    </div>
  );
}
