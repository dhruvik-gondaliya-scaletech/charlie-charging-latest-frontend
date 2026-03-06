'use client';

import * as React from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isWithinInterval,
    startOfDay,
    endOfDay,
    addDays,
    isBefore
} from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { fadeIn, scaleIn } from '@/lib/motion';

interface DatePickerProps {
    dateRange: { from: Date | undefined; to: Date | undefined };
    onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
    className?: string;
}

export function DatePicker({ dateRange, onDateRangeChange, className }: DatePickerProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [viewDate, setViewDate] = React.useState(new Date());
    const [tempRange, setTempRange] = React.useState(dateRange);

    // Sync tempRange when popover opens or dateRange changes externally
    React.useEffect(() => {
        if (isOpen) {
            setTempRange(dateRange);
        }
    }, [isOpen, dateRange]);

    const handlePrevMonth = () => setViewDate(subMonths(viewDate, 1));
    const handleNextMonth = () => setViewDate(addMonths(viewDate, 1));

    const renderCalendar = (monthDate: Date) => {
        const start = startOfMonth(monthDate);
        const end = endOfMonth(monthDate);
        const days = eachDayOfInterval({ start, end });
        const startDayOfWeek = start.getDay();

        return (
            <div className="space-y-4 min-w-[280px]">
                <div className="flex items-center justify-center relative px-8">
                    <div className="text-sm font-black uppercase tracking-widest text-foreground/90">
                        {format(monthDate, 'MMMM yyyy')}
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                        <div key={d} className="text-[10px] font-black text-muted-foreground/60 uppercase py-2">
                            {d}
                        </div>
                    ))}
                    {Array.from({ length: startDayOfWeek }).map((_, i) => (
                        <div key={`pad-${i}`} className="h-9 w-9" />
                    ))}
                    {days.map(day => {
                        const isSelectedStart = tempRange.from && isSameDay(day, tempRange.from);
                        const isSelectedEnd = tempRange.to && isSameDay(day, tempRange.to);
                        const isInRange = tempRange.from && tempRange.to &&
                            isWithinInterval(day, { start: tempRange.from, end: tempRange.to });
                        const isToday = isSameDay(day, new Date());

                        return (
                            <Button
                                key={day.toISOString()}
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "h-9 w-9 rounded-xl text-xs font-bold transition-all relative overflow-hidden group",
                                    (isSelectedStart || isSelectedEnd) && "bg-primary text-primary-foreground hover:bg-primary shadow-lg shadow-primary/20 scale-105 z-10",
                                    isInRange && !isSelectedStart && !isSelectedEnd && "bg-primary/10 text-primary rounded-none",
                                    isInRange && isSelectedStart && tempRange.to && "rounded-r-none",
                                    isInRange && isSelectedEnd && tempRange.from && "rounded-l-none",
                                    !isSameMonth(day, monthDate) && "text-muted-foreground opacity-20 hover:opacity-100",
                                    isToday && !isSelectedStart && !isSelectedEnd && "border border-primary/30"
                                )}
                                onClick={() => handleDayClick(day)}
                            >
                                <span className="relative z-10">{format(day, 'd')}</span>
                                {isToday && !isSelectedStart && !isSelectedEnd && (
                                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                                )}
                            </Button>
                        );
                    })}
                </div>
            </div>
        );
    };

    const handleDayClick = (day: Date) => {
        const clickedDay = startOfDay(day);
        if (!tempRange.from || (tempRange.from && tempRange.to)) {
            setTempRange({ from: clickedDay, to: undefined });
        } else {
            if (isBefore(clickedDay, tempRange.from)) {
                setTempRange({ from: clickedDay, to: tempRange.from });
            } else {
                setTempRange({ from: tempRange.from, to: clickedDay });
            }
        }
    };

    const handleApply = () => {
        onDateRangeChange(tempRange);
        setIsOpen(false);
    };

    const handleReset = () => {
        setTempRange({ from: undefined, to: undefined });
    };

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-auto min-w-[280px] justify-start text-left font-bold rounded-xl border-border/40 bg-card/20 backdrop-blur-md transition-all hover:bg-card/40 hover:border-border/60 group",
                            !dateRange.from && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-3 h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity text-primary" />
                        <span className="flex-1">
                            {dateRange?.from ? (
                                dateRange.to ? (
                                    <>
                                        {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(dateRange.from, "LLL dd, y")
                                )
                            ) : (
                                <span className="uppercase tracking-[0.15em] text-[10px] opacity-70">Select Date Range</span>
                            )}
                        </span>
                        {(dateRange.from || dateRange.to) && (
                            <X
                                className="ml-2 h-3 w-3 opacity-40 hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDateRangeChange({ from: undefined, to: undefined });
                                }}
                            />
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto p-0 rounded-[2rem] border-border/40 bg-card/95 backdrop-blur-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden"
                    align="start"
                    sideOffset={8}
                >
                    <div className="flex flex-col">
                        <div className="flex flex-col md:flex-row p-6 gap-8">
                            {/* Navigation Layer */}
                            <div className="absolute top-6 left-6 right-6 flex justify-between pointer-events-none z-20">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handlePrevMonth}
                                    className="h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm pointer-events-auto border border-border/20 hover:bg-background/80"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleNextMonth}
                                    className="h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm pointer-events-auto border border-border/20 hover:bg-background/80"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Months */}
                            {renderCalendar(viewDate)}
                            <div className="hidden md:block w-px bg-border/20 self-stretch my-2" />
                            <div className="hidden md:block">
                                {renderCalendar(addMonths(viewDate, 1))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between p-4 px-6 bg-muted/30 border-t border-border/20">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                                onClick={handleReset}
                            >
                                Reset
                            </Button>
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-[10px] font-black uppercase tracking-widest px-4 h-9 rounded-xl"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="text-[10px] font-black uppercase tracking-widest px-6 h-9 rounded-xl bg-primary shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all"
                                    onClick={handleApply}
                                >
                                    Apply Range
                                </Button>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
