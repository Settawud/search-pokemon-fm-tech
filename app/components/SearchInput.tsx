"use client";

import { Search, X } from "lucide-react";
import { cn } from "../lib/utils";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function SearchInput({ value, onChange, placeholder = "Search...", className }: SearchInputProps) {
    return (
        <div className={cn("relative group", className)}>
            {/* Search Icon */}
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors duration-200" />
            </div>

            {/* Input */}
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/10 text-white placeholder-slate-500 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all duration-300 text-lg shadow-lg shadow-blue-500/5 hover:border-white/20 hover:bg-slate-900"
            />

            {/* Clear Button */}
            {value && (
                <button
                    onClick={() => onChange("")}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors z-10"
                >
                    <X className="h-5 w-5" />
                </button>
            )}
        </div>
    );
}
