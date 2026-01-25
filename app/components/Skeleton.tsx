"use client";

import { cn } from "../lib/utils";

interface SkeletonProps {
    className?: string;
}

// Base Skeleton component with shimmer animation
export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-slate-800/50",
                className
            )}
        />
    );
}

// Pokemon Card Skeleton
export function PokemonCardSkeleton() {
    return (
        <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4">
            <Skeleton className="w-24 h-24 mx-auto rounded-full mb-3" />
            <Skeleton className="h-5 w-24 mx-auto mb-2" />
            <div className="flex justify-center gap-1">
                <Skeleton className="h-5 w-12 rounded-full" />
                <Skeleton className="h-5 w-12 rounded-full" />
            </div>
        </div>
    );
}

// Pokemon Grid Skeleton (multiple cards)
export function PokemonGridSkeleton({ count = 12 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <PokemonCardSkeleton key={i} />
            ))}
        </div>
    );
}

// Pokemon Detail Skeleton
export function PokemonDetailSkeleton() {
    return (
        <div className="max-w-6xl mx-auto animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Featured Card */}
                    <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8">
                        <Skeleton className="w-12 h-4 mx-auto mb-4" />
                        <Skeleton className="w-48 h-48 mx-auto rounded-full mb-4" />
                        <Skeleton className="h-8 w-40 mx-auto mb-2" />
                        <Skeleton className="h-4 w-32 mx-auto mb-4" />
                        <div className="flex justify-center gap-2">
                            <Skeleton className="h-7 w-16 rounded-full" />
                            <Skeleton className="h-7 w-16 rounded-full" />
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-slate-900/50 border border-white/10 rounded-xl p-4">
                                <Skeleton className="w-8 h-8 mx-auto mb-2 rounded" />
                                <Skeleton className="h-3 w-12 mx-auto mb-1" />
                                <Skeleton className="h-5 w-16 mx-auto" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Resistances & Weaknesses */}
                    <div className="grid grid-cols-2 gap-4">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="bg-slate-900/50 border border-white/10 rounded-xl p-5">
                                <Skeleton className="h-5 w-24 mb-3" />
                                <div className="flex flex-wrap gap-1.5">
                                    {Array.from({ length: 4 }).map((_, j) => (
                                        <Skeleton key={j} className="h-5 w-14 rounded" />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Attacks */}
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="bg-slate-900/50 border border-white/10 rounded-xl p-5">
                            <Skeleton className="h-6 w-32 mb-4" />
                            <div className="space-y-2">
                                {Array.from({ length: 3 }).map((_, j) => (
                                    <Skeleton key={j} className="h-12 w-full rounded-lg" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
