'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from 'date-fns';
import { idTagSchema, IdTagFormValues } from '@/lib/validations/id-tag.schema';
import { AnimatedModal } from '@/components/shared/AnimatedModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useCreateIdTag } from '@/hooks/post/useCreateIdTag';
import { useUpdateIdTag } from '@/hooks/patch/useUpdateIdTag';
import { useDrivers } from '@/hooks/get/useDrivers';
import { useLocations } from '@/hooks/get/useLocations';
import { useStations } from '@/hooks/get/useStations';
import { IdTag, IdTagStatus, TokenType } from '@/types';
import { cn } from '@/lib/utils';
import {
  CreditCard,
  User,
  Activity,
  Calendar as CalendarIcon,
  Loader2,
  Building2,
  MapPin,
  Tag,
  Zap,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  Search,
} from 'lucide-react';

interface IdTagFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IdTag | null;
}

function ExpiryDatePickerField({
  value,
  onChange,
}: {
  value?: string;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => (value ? new Date(value) : new Date()));

  const selectedDate = value ? new Date(value) : undefined;

  const handlePrevMonth = () => setViewDate(subMonths(viewDate, 1));
  const handleNextMonth = () => setViewDate(addMonths(viewDate, 1));

  const start = startOfMonth(viewDate);
  const end = endOfMonth(viewDate);
  const days = eachDayOfInterval({ start, end });
  const startDayOfWeek = start.getDay();

  const handleDaySelect = (day: Date) => {
    const formatted = format(day, 'yyyy-MM-dd');
    onChange(formatted);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange('');
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            'w-full h-11 justify-start text-left font-bold rounded-xl border-border/40 bg-muted/20 hover:bg-muted/40 focus:ring-primary/20 transition-all',
            !value && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-3 h-4 w-4 text-primary opacity-80 shrink-0" />
          <span className="truncate flex-1">
            {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'No Expiry (Never)'}
          </span>
          {value && (
            <div
              role="button"
              className="ml-2 p-1 rounded-md hover:bg-primary/20 transition-all opacity-40 hover:opacity-100 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
            >
              <X className="h-3 w-3" />
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-4 rounded-2xl border-border/40 bg-card/95 backdrop-blur-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] z-[150]"
        align="start"
        sideOffset={6}
      >
        <div className="space-y-3 min-w-[260px]">
          <div className="flex items-center justify-between px-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handlePrevMonth}
              className="h-7 w-7 rounded-full bg-background/50 border border-border/20 hover:bg-background/80"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs font-black uppercase tracking-widest text-foreground">
              {format(viewDate, 'MMMM yyyy')}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleNextMonth}
              className="h-7 w-7 rounded-full bg-background/50 border border-border/20 hover:bg-background/80"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <div key={d} className="text-[10px] font-black text-muted-foreground/60 uppercase py-1">
                {d}
              </div>
            ))}
            {Array.from({ length: startDayOfWeek }).map((_, i) => (
              <div key={`pad-${i}`} className="h-8 w-8" />
            ))}
            {days.map((day) => {
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());

              return (
                <Button
                  key={day.toISOString()}
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'h-8 w-8 rounded-xl text-xs font-bold transition-all',
                    isSelected
                      ? 'bg-primary text-primary-foreground font-black shadow-lg shadow-primary/20 hover:bg-primary scale-105'
                      : 'hover:bg-muted/60 text-foreground',
                    !isSameMonth(day, viewDate) && 'text-muted-foreground opacity-20',
                    isToday && !isSelected && 'border border-primary/40 text-primary'
                  )}
                  onClick={() => handleDaySelect(day)}
                >
                  {format(day, 'd')}
                </Button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/20">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground"
              onClick={handleClear}
            >
              Clear
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10"
              onClick={() => handleDaySelect(new Date())}
            >
              Today
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function DriverPickerField({
  value,
  onChange,
}: {
  value?: string;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: drivers, isLoading } = useDrivers({ search: searchQuery || undefined });

  const selectedDriver = drivers?.find((d) => d.id === value);
  const selectedLabel =
    !value
      ? 'None (Unassigned)'
      : selectedDriver
      ? `${selectedDriver.firstName} ${selectedDriver.lastName}`.trim()
      : 'Selected Driver';

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full h-11 justify-start text-left font-bold rounded-xl border-border/40 bg-muted/20 hover:bg-muted/40 focus:ring-primary/20 transition-all"
        >
          <User className="mr-2 h-4 w-4 text-muted-foreground/50 shrink-0" />
          <span className="truncate flex-1">
            {isLoading ? 'Loading...' : selectedLabel}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[280px] sm:w-[340px] p-3 rounded-2xl border-border/40 bg-card/95 backdrop-blur-2xl shadow-2xl z-[150] space-y-2.5"
        align="start"
        sideOffset={6}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
          <Input
            placeholder="Search driver by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-8 h-9 text-xs bg-muted/20 border-border/40 focus:ring-primary/20 rounded-xl font-medium"
          />
          {searchQuery && (
            <X
              className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 hover:text-foreground cursor-pointer"
              onClick={() => setSearchQuery('')}
            />
          )}
        </div>

        <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
          <button
            type="button"
            className={cn(
              'w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between',
              !value
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-muted/50 text-muted-foreground italic'
            )}
            onClick={() => {
              onChange('');
              setIsOpen(false);
            }}
          >
            <span>None (Unassigned)</span>
          </button>
          {isLoading ? (
            <div className="p-4 text-center text-xs font-bold text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" /> Searching...
            </div>
          ) : drivers?.length === 0 ? (
            <div className="p-4 text-center text-xs font-bold text-muted-foreground uppercase tracking-widest">
              No drivers found
            </div>
          ) : (
            drivers?.map((driver) => {
              const fullName = `${driver.firstName} ${driver.lastName}`.trim();
              const isSelected = driver.id === value;
              return (
                <button
                  key={driver.id}
                  type="button"
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between',
                    isSelected
                      ? 'bg-primary text-primary-foreground font-black shadow-md shadow-primary/20'
                      : 'hover:bg-muted/50 text-foreground'
                  )}
                  onClick={() => {
                    onChange(driver.id);
                    setIsOpen(false);
                  }}
                >
                  <span className="truncate">{fullName}</span>
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function IdTagFormModal({ isOpen, onClose, initialData }: IdTagFormModalProps) {
  const isEditing = !!initialData;
  const createIdTag = useCreateIdTag();
  const updateIdTag = useUpdateIdTag(initialData?.idTag || '');
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const { data: drivers, isLoading: isLoadingDrivers } = useDrivers();
  const { data: rawLocations, isLoading: isLoadingLocations } = useLocations({ name: locationSearchQuery || undefined });
  const locations = Array.isArray(rawLocations) ? rawLocations : (rawLocations?.items || rawLocations?.data || []);
  const { data: rawStations } = useStations();
  const stations = Array.isArray(rawStations) ? rawStations : (rawStations?.items || rawStations?.data || []);

  const [expandedLocations, setExpandedLocations] = useState<Record<string, boolean>>({});

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<IdTagFormValues>({
    resolver: zodResolver(idTagSchema),
    defaultValues: {
      idTag: '',
      status: IdTagStatus.ACCEPTED,
      idTagType: TokenType.RFID,
      driverId: '',
      stationId: '',
      locationIds: [],
      companyName: '',
      expiryDate: '',
    },
  });

  const selectedLocationIds = watch('locationIds') || [];

  useEffect(() => {
    setLocationSearchQuery('');
    if (initialData) {
      reset({
        idTag: initialData.idTag,
        status: initialData.status,
        idTagType: (initialData.idTagType as TokenType) || TokenType.RFID,
        driverId: initialData.driverId || '',
        stationId: initialData.stationId || '',
        locationIds: initialData.locations ? initialData.locations.map((l) => l.id) : [],
        companyName: initialData.companyName || '',
        expiryDate: initialData.expiryDate ? new Date(initialData.expiryDate).toISOString().split('T')[0] : '',
      });
    } else {
      reset({
        idTag: '',
        status: IdTagStatus.ACCEPTED,
        idTagType: TokenType.RFID,
        driverId: '',
        stationId: '',
        locationIds: [],
        companyName: '',
        expiryDate: '',
      });
    }
  }, [initialData, reset]);

  const toggleExpandLocation = (locId: string) => {
    setExpandedLocations((prev) => ({ ...prev, [locId]: !prev[locId] }));
  };

  const toggleLocationSelect = (locId: string) => {
    const current = [...selectedLocationIds];
    const index = current.indexOf(locId);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(locId);
    }
    setValue('locationIds', current);
  };

  const onSubmit = (data: IdTagFormValues) => {
    const payload = {
      ...data,
      idTagType: data.idTagType,
      driverId: data.driverId ? data.driverId : null,
      stationId: data.stationId ? data.stationId : null,
      companyName: data.companyName || null,
      expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString() : undefined,
      locationIds: selectedLocationIds,
    };

    if (isEditing) {
      const { idTag: _, ...updatePayload } = payload;
      updateIdTag.mutate(updatePayload, {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    } else {
      createIdTag.mutate(payload, {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    }
  };

  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={() => {
        reset();
        onClose();
      }}
      title={isEditing ? 'Modify Access Token' : 'Enroll New Access Token'}
      description={
        isEditing
          ? 'Update existing RFID tag credentials, type, and location permissions.'
          : 'Register a new RFID tag, assign type, and configure location permissions.'
      }
      size="2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="idTag" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">
              RFID Tag ID
            </Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
              <Input
                id="idTag"
                placeholder="TAG123456"
                disabled={isEditing}
                className="pl-10 h-11 bg-muted/20 border-border/40 focus:ring-primary/20 rounded-xl font-bold uppercase tracking-widest"
                {...register('idTag')}
              />
            </div>
            {errors.idTag && (
              <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.idTag.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="idTagType" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">
              Token Type
            </Label>
            <Controller
              control={control}
              name="idTagType"
              render={({ field }) => (
                <Select
                  onValueChange={(val) => {
                    field.onChange(val);
                    trigger('idTag');
                  }}
                  value={field.value}
                >
                  <SelectTrigger className="h-11 bg-muted/20 border-border/40 focus:ring-primary/20 rounded-xl font-bold w-full">
                    <div className="flex items-center gap-2 min-w-0">
                      <Tag className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                      <SelectValue placeholder="Select token type" className="truncate" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/40 bg-background/95 backdrop-blur-xl max-w-[calc(100vw-2rem)]">
                    {Object.values(TokenType).map((type) => (
                      <SelectItem key={type} value={type} className="font-bold py-2.5">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.idTagType && (
              <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.idTagType.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">
              Company Name
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
              <Input
                id="companyName"
                placeholder="e.g. Tesla Inc."
                className="pl-10 h-11 bg-muted/20 border-border/40 focus:ring-primary/20 rounded-xl font-bold"
                {...register('companyName')}
              />
            </div>
            {errors.companyName && (
              <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.companyName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="driverId" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">
              Assign to Driver
            </Label>
            <Controller
              control={control}
              name="driverId"
              render={({ field }) => (
                <DriverPickerField
                  value={field.value || undefined}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.driverId && (
              <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.driverId.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">
              Token Status
            </Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="h-11 bg-muted/20 border-border/40 focus:ring-primary/20 rounded-xl font-bold">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-muted-foreground/50" />
                      <SelectValue placeholder="Select status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/40 bg-background/95 backdrop-blur-xl">
                    {Object.values(IdTagStatus).map((status) => (
                      <SelectItem key={status} value={status} className="font-bold py-2.5">
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.status.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryDate" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">
              Expiry Date
            </Label>
            <Controller
              control={control}
              name="expiryDate"
              render={({ field }) => (
                <ExpiryDatePickerField
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.expiryDate && (
              <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.expiryDate.message}</p>
            )}
          </div>
        </div>

        {/* Locations & Stations Selection */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between ml-1">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" /> Allowed Locations
            </Label>
            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary border-primary/20">
              {selectedLocationIds.length} {selectedLocationIds.length === 1 ? 'location' : 'locations'} selected
            </Badge>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
            <Input
              placeholder="Search location by name..."
              value={locationSearchQuery}
              onChange={(e) => setLocationSearchQuery(e.target.value)}
              className="pl-9 pr-8 h-9 text-xs bg-muted/20 border-border/40 focus:ring-primary/20 rounded-xl font-medium"
            />
            {locationSearchQuery && (
              <X
                className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 hover:text-foreground cursor-pointer"
                onClick={() => setLocationSearchQuery('')}
              />
            )}
          </div>

          <div className="max-h-52 overflow-y-auto p-3 rounded-xl bg-muted/20 border border-border/40 space-y-2">
            {isLoadingLocations ? (
              <div className="p-4 text-center text-xs font-bold text-muted-foreground flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" /> Loading locations...
              </div>
            ) : locations?.length === 0 ? (
              <div className="p-4 text-center text-xs font-bold text-muted-foreground uppercase tracking-widest">
                {locationSearchQuery ? `No locations matching "${locationSearchQuery}"` : 'No locations available'}
              </div>
            ) : (
              locations?.map((location) => {
                const isLocSelected = selectedLocationIds.includes(location.id);
                const locStations = stations?.filter((s) => s.locationId === location.id) || [];
                const isExpanded = !!expandedLocations[location.id];

                return (
                  <div key={location.id} className="rounded-xl border border-border/30 bg-background/50 overflow-hidden">
                    <div className="flex items-center justify-between p-2.5 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => toggleExpandLocation(location.id)}
                          className="p-1 hover:bg-muted/50 rounded-md text-muted-foreground/70"
                        >
                          {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                        </button>
                        <Checkbox
                          checked={isLocSelected}
                          onCheckedChange={() => toggleLocationSelect(location.id)}
                          id={`loc-${location.id}`}
                        />
                        <label
                          htmlFor={`loc-${location.id}`}
                          className="flex items-center gap-2 text-xs font-bold text-foreground cursor-pointer select-none"
                        >
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground/60" />
                          {location.name}
                        </label>
                      </div>
                      {locStations.length > 0 && (
                        <Badge variant="secondary" className="text-[9px] font-extrabold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                          {locStations.length} {locStations.length === 1 ? 'station' : 'stations'}
                        </Badge>
                      )}
                    </div>

                    {isExpanded && locStations.length > 0 && (
                      <div className="pl-9 pr-3 py-2 bg-muted/10 border-t border-border/20 space-y-1.5">
                        {locStations.map((st) => (
                          <div key={st.id} className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                            <Zap className="h-3 w-3 text-amber-500/70" />
                            <span>{st.name} ({st.chargePointId})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
          {errors.locationIds && (
            <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1">{errors.locationIds.message}</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] border-border/40 hover:bg-muted"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createIdTag.isPending || updateIdTag.isPending}
            className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] bg-primary shadow-lg shadow-primary/20"
          >
            {createIdTag.isPending || updateIdTag.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isEditing ? (
              'Store Changes'
            ) : (
              'Activate Token'
            )}
          </Button>
        </div>
      </form>
    </AnimatedModal>
  );
}


