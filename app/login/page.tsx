import Image from "next/image";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white lg:flex-row">
      <div className="flex flex-1 flex-col px-6 pt-8 sm:px-12 lg:px-20 lg:pt-10">
        <header className="flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element -- fixed-height SVG logo, no next/image optimization needed */}
          <img src="/assets/hush-lush-logo.svg" alt="Hush Lush Advertising & Technologies" className="h-10 w-auto" />
          <nav className="hidden items-center gap-10 text-sm text-gray-600 sm:flex">
            <span className="border-b-2 border-primary pb-1 font-medium text-foreground">Home</span>
            <span>Pricing</span>
            <span>Contact Us</span>
          </nav>
        </header>

        <main className="flex flex-1 items-center">
          <div className="flex w-full flex-col gap-10 py-12">
            <h1 className="text-4xl font-semibold tracking-[0.3em] text-foreground">Login</h1>
            <LoginForm />
          </div>
        </main>
      </div>

      <div
        className="relative hidden flex-1 items-center justify-center overflow-hidden bg-white lg:flex"
        style={{
          backgroundImage: [
            "radial-gradient(circle at 92% 50%, #f9b0b4 0%, #f9b0b4 56%, transparent 56%)",
            "radial-gradient(circle at 92% 50%, #fdc6c8 0%, #fdc6c8 70%, transparent 70%)",
            "radial-gradient(circle at 92% 50%, #ffdbdc 0%, #ffdbdc 85%, transparent 85%)",
          ].join(", "),
        }}
      >
        <div className="relative h-[70vh] w-[70vh] max-h-[640px] max-w-[640px]">
          <Image
            src="/assets/hush-lush-phoenix.png"
            alt="Hush Lush phoenix emblem"
            fill
            sizes="640px"
            className="object-contain drop-shadow-xl"
            priority
          />
        </div>
      </div>

      {/* Compact gradient strip for small/medium screens where the side panel is hidden */}
      <div
        className="h-24 w-full lg:hidden"
        style={{
          background: "linear-gradient(90deg, #ffffff 0%, #fdd9dc 50%, #f7a7ac 100%)",
        }}
      />
    </div>
  );
}
