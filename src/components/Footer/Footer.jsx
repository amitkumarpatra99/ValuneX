import React from "react";

export default function Footer() {
  return (
        <footer className="w-full py-8 mt-12 border-t border-white/5 text-center text-slate-400 text-sm relative z-10">
           <div className="container mx-auto px-6">
             <p className="mb-2">
               Made with ❤️ by <span className=" font-bold bg-white/5 px-2 py-0.5 rounded-md">MR PATRA</span>
             </p>
             <p className="text-xs text-slate-500">
               © {new Date().getFullYear()} All Rights Reserved.
             </p>
           </div>
        </footer>
  );
}
