'use client';

import * as React from 'react';
import { useInView } from 'react-intersection-observer';
import { Search, ChevronDown, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/use-debounce';

interface InfiniteScrollDropdownProps<T> {
    options: T[];
    value?: string;
    onValueChange: (value: string) => void;
    isLoading?: boolean;
    isFetchingNextPage?: boolean;
    hasNextPage?: boolean;
    fetchNextPage: () => void;
    onSearchChange?: (search: string) => void;
    getOptionLabel: (option: T) => string;
    getOptionValue: (option: T) => string;
    placeholder?: string;
    searchPlaceholder?: string;
    className?: string;
    disabled?: boolean;
}

export function InfiniteScrollDropdown<T>({
    options,
    value,
    onValueChange,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    onSearchChange,
    getOptionLabel,
    getOptionValue,
    placeholder = 'Select an option...',
    searchPlaceholder = 'Search...',
    className,
    disabled,
}: InfiniteScrollDropdownProps<T>) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState('');
    const debouncedSearch = useDebounce(search, 300);

    const { ref, inView } = useInView({
        threshold: 0,
    });

    React.useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    React.useEffect(() => {
        onSearchChange?.(debouncedSearch);
    }, [debouncedSearch, onSearchChange]);

    const selectedOption = options.find((opt) => getOptionValue(opt) === value);
    const displayLabel = selectedOption ? getOptionLabel(selectedOption) : placeholder;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        'w-full justify-between bg-muted/30 border-border/60 hover:bg-muted/40 transition-all font-medium py-6 rounded-xl',
                        !value && 'text-muted-foreground',
                        className
                    )}
                    disabled={disabled || isLoading}
                >
                    <span className="truncate">{displayLabel}</span>
                    {isLoading ? (
                        <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin opacity-50" />
                    ) : (
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0 rounded-xl overflow-hidden shadow-2xl border-border/60" align="start">
                <div className="flex items-center border-b px-3 bg-muted/20">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <input
                        className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder={searchPlaceholder}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                    {options.length === 0 && !isLoading ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                            No results found.
                        </div>
                    ) : (
                        <div className="p-1">
                            {options.map((option) => {
                                const optValue = getOptionValue(option);
                                const isSelected = value === optValue;
                                return (
                                    <button
                                        key={optValue}
                                        className={cn(
                                            'relative flex w-full cursor-default select-none items-center rounded-lg py-2.5 px-3 text-sm outline-none transition-colors hover:bg-primary/10 hover:text-primary',
                                            isSelected ? 'bg-primary/5 font-bold text-primary' : 'text-foreground'
                                        )}
                                        onClick={() => {
                                            onValueChange(optValue);
                                            setOpen(false);
                                        }}
                                    >
                                        <span className="truncate flex-1 text-left">{getOptionLabel(option)}</span>
                                        {isSelected && <Check className="ml-auto h-4 w-4 shrink-0" />}
                                    </button>
                                );
                            })}

                            {/* Intersection Observer Trigger */}
                            <div ref={ref} className="h-10 flex items-center justify-center">
                                {isFetchingNextPage && (
                                    <Loader2 className="h-4 w-4 animate-spin text-primary opacity-50" />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
