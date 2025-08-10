import React from "react";

type Props = {};

export default function PartnersInfiniteScroll({}: Props) {
  return (
    <section>
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll">
            {/* First set of logos */}
            <div className="flex items-center gap-12 px-6">
              <div className="flex items-center justify-center w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <span className="text-xl font-bold text-gray-700">
                  Growth Room
                </span>
              </div>
              <div className="flex items-center justify-center w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <span className="text-xl font-bold text-gray-700">VINCI</span>
              </div>
              <div className="flex items-center justify-center w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <span className="text-sm font-medium text-gray-700">
                  pass Culture
                </span>
              </div>
              <div className="flex items-center justify-center w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <span className="text-sm font-medium text-gray-700">
                  Too Good To Go
                </span>
              </div>
              <div className="flex items-center justify-center w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <span className="text-lg font-bold text-gray-700">
                  Cyberlift
                </span>
              </div>
              <div className="flex items-center justify-center w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <svg
                  className="w-12 h-12 text-gray-700"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div className="flex items-center justify-center w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <svg
                  className="w-16 h-8 text-gray-700"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 7.8C23.6 7.3 22.9 7 22.2 7H1.8C1.1 7 .4 7.3 0 7.8v8.4c.4.5 1.1.8 1.8.8h20.4c.7 0 1.4-.3 1.8-.8V7.8zM12 15.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z" />
                </svg>
              </div>
            </div>

            {/* Duplicate set for seamless loop */}
            <div className="flex items-center gap-12 px-6">
              <div className="flex items-center justify-center w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <span className="text-xl font-bold text-gray-700">
                  Growth Room
                </span>
              </div>
              <div className="flex items-center justify-center w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <span className="text-xl font-bold text-gray-700">VINCI</span>
              </div>
              <div className="flex items-center justify-center w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <span className="text-sm font-medium text-gray-700">
                  pass Culture
                </span>
              </div>
              <div className="flex items-center justify-center w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <span className="text-sm font-medium text-gray-700">
                  Too Good To Go
                </span>
              </div>
              <div className="flex items-center justify-center w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <span className="text-lg font-bold text-gray-700">
                  Cyberlift
                </span>
              </div>
              <div className="flex items-center justify-center w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <svg
                  className="w-12 h-12 text-gray-700"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div className="flex items-center justify-center w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <svg
                  className="w-16 h-8 text-gray-700"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 7.8C23.6 7.3 22.9 7 22.2 7H1.8C1.1 7 .4 7.3 0 7.8v8.4c.4.5 1.1.8 1.8.8h20.4c.7 0 1.4-.3 1.8-.8V7.8zM12 15.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
