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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { fadeIn, scaleIn } from '@/lib/motion';

interface DatePickerProps {
    dateRange: { from: Date | undefined; to: Date | undefined };
    onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
    className?: string;
    showTimeSelect?: boolean;
    accentColor?: 'primary' | 'emerald' | 'amber' | 'rose';
}

export function DatePicker({
    dateRange,
    onDateRangeChange,
    className,
    showTimeSelect = false,
    accentColor = 'primary',
}: DatePickerProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [viewDate, setViewDate] = React.useState(new Date());
    const [tempRange, setTempRange] = React.useState(dateRange);
    const [startTime, setStartTime] = React.useState({ hours: 0, minutes: 0 });
    const [endTime, setEndTime] = React.useState({ hours: 23, minutes: 59 });

    const getIconColor = () => {
        switch (accentColor) {
            case 'emerald': return 'text-emerald-500';
            case 'amber': return 'text-amber-500';
            case 'rose': return 'text-rose-500';
            default: return 'text-primary';
        }
    };

    const getSelectedDayBg = () => {
        switch (accentColor) {
            case 'emerald': return 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20';
            case 'amber': return 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20';
            case 'rose': return 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20';
            default: return 'bg-primary text-primary-foreground hover:bg-primary shadow-lg shadow-primary/20';
        }
    };

    const getRangeDayBg = () => {
        switch (accentColor) {
            case 'emerald': return 'bg-emerald-500/10 text-emerald-500';
            case 'amber': return 'bg-amber-500/10 text-amber-500';
            case 'rose': return 'bg-rose-500/10 text-rose-500';
            default: return 'bg-primary/10 text-primary';
        }
    };

    const getApplyBtnBg = () => {
        switch (accentColor) {
            case 'emerald': return 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 hover:shadow-emerald-500/30';
            case 'amber': return 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20 hover:shadow-amber-500/30';
            case 'rose': return 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20 hover:shadow-rose-500/30';
            default: return 'bg-primary text-primary-foreground shadow-primary/20 hover:shadow-primary/30';
        }
    };

    const iconColor = getIconColor();
    const selectedDayBg = getSelectedDayBg();
    const rangeDayBg = getRangeDayBg();
    const applyBtnBg = getApplyBtnBg();

    // Sync tempRange when popover opens or dateRange changes externally
    React.useEffect(() => {
        if (isOpen) {
            setTempRange(dateRange);
            if (dateRange.from) {
                setStartTime({
                    hours: dateRange.from.getHours(),
                    minutes: dateRange.from.getMinutes(),
                });
            } else {
                setStartTime({ hours: 0, minutes: 0 });
            }
            if (dateRange.to) {
                setEndTime({
                    hours: dateRange.to.getHours(),
                    minutes: dateRange.to.getMinutes(),
                });
            } else {
                setEndTime({ hours: 23, minutes: 59 });
            }
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
                                    (isSelectedStart || isSelectedEnd) && `${selectedDayBg} scale-105 z-10`,
                                    isInRange && !isSelectedStart && !isSelectedEnd && `${rangeDayBg} rounded-none`,
                                    isInRange && isSelectedStart && tempRange.to && "rounded-r-none",
                                    isInRange && isSelectedEnd && tempRange.from && "rounded-l-none",
                                    !isSameMonth(day, monthDate) && "text-muted-foreground opacity-20 hover:opacity-100",
                                    isToday && !isSelectedStart && !isSelectedEnd && "border border-muted-foreground/30"
                                )}
                                onClick={() => handleDayClick(day)}
                            >
                                <span className="relative z-10">{format(day, 'd')}</span>
                                {isToday && !isSelectedStart && !isSelectedEnd && (
                                    <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${iconColor}`} />
                                )}
                            </Button>
                        );
                    })}
                </div>
            </div>
        );
    };

    const handleStartTimeChange = (hours: number, minutes: number) => {
        setStartTime({ hours, minutes });
        if (tempRange.from) {
            const newFrom = new Date(tempRange.from);
            newFrom.setHours(hours, minutes, 0, 0);
            setTempRange(prev => ({ ...prev, from: newFrom }));
        }
    };

    const handleEndTimeChange = (hours: number, minutes: number) => {
        setEndTime({ hours, minutes });
        if (tempRange.to) {
            const newTo = new Date(tempRange.to);
            newTo.setHours(hours, minutes, 59, 999);
            setTempRange(prev => ({ ...prev, to: newTo }));
        }
    };

    const handleDayClick = (day: Date) => {
        const clickedDay = startOfDay(day);
        if (!tempRange.from || (tempRange.from && tempRange.to)) {
            const newFrom = new Date(clickedDay);
            newFrom.setHours(startTime.hours, startTime.minutes, 0, 0);
            setTempRange({ from: newFrom, to: undefined });
        } else {
            if (isBefore(clickedDay, tempRange.from)) {
                const newFrom = new Date(clickedDay);
                newFrom.setHours(startTime.hours, startTime.minutes, 0, 0);
                const newTo = new Date(tempRange.from);
                newTo.setHours(endTime.hours, endTime.minutes, 59, 999);
                setTempRange({ from: newFrom, to: newTo });
            } else {
                const newFrom = new Date(tempRange.from);
                newFrom.setHours(startTime.hours, startTime.minutes, 0, 0);
                const newTo = new Date(clickedDay);
                newTo.setHours(endTime.hours, endTime.minutes, 59, 999);
                setTempRange({ from: newFrom, to: newTo });
            }
        }
    };

    const handleApply = () => {
        onDateRangeChange(tempRange);
        setIsOpen(false);
    };

    const handleReset = () => {
        setTempRange({ from: undefined, to: undefined });
        setStartTime({ hours: 0, minutes: 0 });
        setEndTime({ hours: 23, minutes: 59 });
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
                        <CalendarIcon className={cn("mr-3 h-4 w-4 opacity-80 group-hover:opacity-100 transition-opacity", iconColor)} />
                        <span className="flex-1">
                            {dateRange?.from ? (
                                dateRange.to ? (
                                    <>
                                        {format(dateRange.from, showTimeSelect ? "LLL dd, y HH:mm" : "LLL dd, y")} - {format(dateRange.to, showTimeSelect ? "LLL dd, y HH:mm" : "LLL dd, y")}
                                    </>
                                ) : (
                                    format(dateRange.from, showTimeSelect ? "LLL dd, y HH:mm" : "LLL dd, y")
                                )
                            ) : (
                                <span className="uppercase tracking-[0.15em] text-[10px] opacity-70">Select Date Range</span>
                            )}
                        </span>
                        {(dateRange.from || dateRange.to) && (
                            <div
                                role="button"
                                aria-label="Clear date range"
                                className="ml-2 p-1 rounded-md hover:bg-primary/20 transition-all opacity-40 hover:opacity-100 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    onDateRangeChange({ from: undefined, to: undefined });
                                    setTempRange({ from: undefined, to: undefined });
                                }}
                            >
                                <X className="h-3 w-3" />
                            </div>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto p-0 rounded-[2rem] border-border/40 bg-card/95 backdrop-blur-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden z-[150]"
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

                        {showTimeSelect && (
                            <div className="flex flex-col sm:flex-row items-center gap-6 px-6 py-4 border-t border-border/20 bg-muted/10 justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Start Time:</span>
                                    <div className="flex items-center gap-1">
                                        <Select
                                            value={startTime.hours.toString()}
                                            onValueChange={(val) => handleStartTimeChange(Number(val), startTime.minutes)}
                                        >
                                            <SelectTrigger className="h-8 w-[65px] bg-background/50 border border-border/40 rounded-xl font-bold text-xs justify-between">
                                                <SelectValue placeholder="00" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border border-border/40 bg-card/95 backdrop-blur-xl max-h-[200px] z-[200] overflow-y-auto">
                                                {Array.from({ length: 24 }).map((_, h) => (
                                                    <SelectItem key={h} value={h.toString()} className="text-xs font-semibold">
                                                        {String(h).padStart(2, '0')}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <span className="text-xs font-bold text-muted-foreground">:</span>
                                        <Select
                                            value={startTime.minutes.toString()}
                                            onValueChange={(val) => handleStartTimeChange(startTime.hours, Number(val))}
                                        >
                                            <SelectTrigger className="h-8 w-[65px] bg-background/50 border border-border/40 rounded-xl font-bold text-xs justify-between">
                                                <SelectValue placeholder="00" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border border-border/40 bg-card/95 backdrop-blur-xl max-h-[200px] z-[200] overflow-y-auto">
                                                {Array.from({ length: 60 }).map((_, m) => (
                                                    <SelectItem key={m} value={m.toString()} className="text-xs font-semibold">
                                                        {String(m).padStart(2, '0')}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">End Time:</span>
                                    <div className="flex items-center gap-1">
                                        <Select
                                            value={endTime.hours.toString()}
                                            onValueChange={(val) => handleEndTimeChange(Number(val), endTime.minutes)}
                                        >
                                            <SelectTrigger className="h-8 w-[65px] bg-background/50 border border-border/40 rounded-xl font-bold text-xs justify-between">
                                                <SelectValue placeholder="00" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border border-border/40 bg-card/95 backdrop-blur-xl max-h-[200px] z-[200] overflow-y-auto">
                                                {Array.from({ length: 24 }).map((_, h) => (
                                                    <SelectItem key={h} value={h.toString()} className="text-xs font-semibold">
                                                        {String(h).padStart(2, '0')}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <span className="text-xs font-bold text-muted-foreground">:</span>
                                        <Select
                                            value={endTime.minutes.toString()}
                                            onValueChange={(val) => handleEndTimeChange(endTime.hours, Number(val))}
                                        >
                                            <SelectTrigger className="h-8 w-[65px] bg-background/50 border border-border/40 rounded-xl font-bold text-xs justify-between">
                                                <SelectValue placeholder="00" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border border-border/40 bg-card/95 backdrop-blur-xl max-h-[200px] z-[200] overflow-y-auto">
                                                {Array.from({ length: 60 }).map((_, m) => (
                                                    <SelectItem key={m} value={m.toString()} className="text-xs font-semibold">
                                                        {String(m).padStart(2, '0')}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        )}

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
