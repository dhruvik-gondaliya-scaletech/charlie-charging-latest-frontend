import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Simple interfaces for geocoding
interface GeocodingResult {
    place_id: string;
    display_name: string;
    latitude: number;
    longitude: number;
    address: {
        house_number?: string;
        road?: string;
        suburb?: string;
        city?: string;
        town?: string;
        village?: string;
        county?: string;
        state?: string;
        postcode?: string;
        country?: string;
        country_code?: string;
    };
    type: string;
    class: string;
    importance: number;
}

export interface ParsedAddress {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude?: number;
    longitude?: number;
}

interface AddressAutocompleteProps {
    onAddressSelect: (address: ParsedAddress) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    defaultValue?: string;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
    onAddressSelect,
    placeholder = "Search for an address...",
    className,
    disabled = false,
    defaultValue = "",
}) => {
    const [query, setQuery] = useState(defaultValue);
    const [results, setResults] = useState<GeocodingResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [error, setError] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<any>(null);

    useEffect(() => {
        if (defaultValue !== query && defaultValue !== "") {
            setQuery(defaultValue);
        }
    }, [defaultValue]);

    // Simple search function using OpenStreetMap Nominatim
    const searchAddresses = async (searchQuery: string) => {
        if (searchQuery.length < 3) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?` +
                new URLSearchParams({
                    q: searchQuery,
                    format: 'json',
                    addressdetails: '1',
                    limit: '5',
                    countrycodes: '', // Worldwide search
                    'accept-language': 'en',
                }),
                {
                    headers: {
                        'User-Agent': 'CharliChargingCSMS/1.0 (contact@example.com)',
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                setResults([]);
                setIsOpen(false);
                return;
            }

            const results: GeocodingResult[] = data.map((item: Record<string, any>, index: number): GeocodingResult => ({
                place_id: String(item.place_id || index),
                display_name: item.display_name,
                latitude: parseFloat(item.lat),
                longitude: parseFloat(item.lon),
                address: item.address || {},
                type: item.type,
                class: item.class,
                importance: item.importance || 0,
            }));

            setResults(results);
            setIsOpen(results.length > 0);
            setSelectedIndex(-1);
        } catch (err) {
            console.error('Geocoding error:', err);
            setError('Failed to search addresses. Please try again.');
            setResults([]);
            setIsOpen(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle input change with debouncing
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        // Clear previous timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout for debouncing (1 second to respect Nominatim rate limits)
        timeoutRef.current = setTimeout(() => {
            searchAddresses(value);
        }, 1000);
    };

    // Parse address from result
    const parseAddress = (result: GeocodingResult): ParsedAddress => {
        const addr = result.address;

        // Build street address
        const streetParts = [];
        if (addr.house_number) streetParts.push(addr.house_number);
        if (addr.road) streetParts.push(addr.road);
        const streetAddress = streetParts.join(' ') || result.display_name.split(',')[0];

        // Get city (try different fields)
        const city = addr.city || addr.town || addr.village || addr.suburb || '';

        // Get state/province
        const state = addr.state || addr.county || '';

        // Get postal code
        const zipCode = addr.postcode || '';

        // Get country
        const country = addr.country || '';

        return {
            address: streetAddress,
            city,
            state,
            zipCode,
            country,
            latitude: result.latitude,
            longitude: result.longitude,
        };
    };

    // Handle result selection
    const handleResultSelect = (result: GeocodingResult) => {
        const parsedAddress = parseAddress(result);
        setQuery(result.display_name);
        setIsOpen(false);
        setResults([]);
        onAddressSelect(parsedAddress);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || results.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < results.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && selectedIndex < results.length) {
                    handleResultSelect(results[selectedIndex]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setSelectedIndex(-1);
                inputRef.current?.blur();
                break;
        }
    };

    // Clear search
    const handleClear = () => {
        setQuery('');
        setResults([]);
        setIsOpen(false);
        setError(null);
        inputRef.current?.focus();
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                resultsRef.current &&
                !resultsRef.current.contains(event.target as Node) &&
                !inputRef.current?.contains(event.target as Node)
            ) {
                setIsOpen(false);
                setSelectedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div className={cn("relative w-full", className)}>
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/10 to-violet-500/10 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        disabled={disabled}
                        className="pl-10 pr-10 bg-background/50 backdrop-blur-md border-border/40 focus:border-primary/40 focus:ring-0 transition-all h-12 rounded-xl text-sm font-medium"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                        {isLoading && (
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        )}
                        {query && !isLoading && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={handleClear}
                                className="h-7 w-7 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                                title="Clear search"
                            >
                                <X className="h-3.5 w-3.5" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Error message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-2 text-xs font-medium text-destructive px-1"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results dropdown */}
            <AnimatePresence>
                {isOpen && results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 4, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        className="absolute top-full left-0 right-0 z-[100] mt-3"
                    >
                        <Card className="shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border-border/60 bg-background/98 dark:bg-zinc-950 backdrop-blur-xl overflow-hidden rounded-2xl ring-1 ring-white/10">
                            <CardContent className="p-2 max-h-[350px] overflow-y-auto custom-scrollbar">
                                <div ref={resultsRef}>
                                    {results.map((result, index) => (
                                        <button
                                            key={result.place_id}
                                            type="button"
                                            className={cn(
                                                "w-full flex items-start gap-3.5 p-3.5 text-left rounded-xl transition-all duration-300",
                                                selectedIndex === index
                                                    ? "bg-primary/15 text-primary scale-[1.01] shadow-lg shadow-primary/5"
                                                    : "hover:bg-primary/5 text-foreground/80 hover:text-foreground hover:translate-x-1"
                                            )}
                                            onClick={() => handleResultSelect(result)}
                                        >
                                            <div className={cn(
                                                "p-2 rounded-lg shrink-0 mt-0.5 transition-colors duration-300",
                                                selectedIndex === index ? "bg-primary/20 text-primary" : "bg-muted/50 text-muted-foreground"
                                            )}>
                                                <MapPin className="h-4 w-4" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="text-[13px] font-bold tracking-tight truncate text-foreground">
                                                    {parseAddress(result).address}
                                                </div>
                                                <div className="text-[11px] text-muted-foreground font-semibold line-clamp-1 mt-1 leading-relaxed">
                                                    {result.display_name}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* No results message */}
            <AnimatePresence>
                {isOpen && !isLoading && results.length === 0 && query.length >= 3 && !error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 4 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 z-[60]"
                    >
                        <Card className="shadow-xl border-border/50 bg-background/80 backdrop-blur-xl rounded-xl">
                            <CardContent className="p-6 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="p-3 bg-muted rounded-full">
                                        <Search className="h-5 w-5 text-muted-foreground opacity-20" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold">No addresses found</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            We couldn't find any results for "{query}"
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AddressAutocomplete;
