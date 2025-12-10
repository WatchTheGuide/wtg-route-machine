/**
 * AddressSearch Component (US 8.6.1)
 *
 * Search input with autocomplete for geocoding addresses using Nominatim API.
 * Features:
 * - Debounced search (300ms)
 * - Autocomplete suggestions
 * - Loading state
 * - City bounding box support
 * - Keyboard navigation
 */

import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, X, Loader2 } from 'lucide-react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { useGeocoding } from '@/hooks/useGeocoding';
import type {
  GeocodingResult,
  BoundingBox,
} from '@/services/geocoding.service';

export interface AddressSearchProps {
  /** Callback when a location is selected */
  onSelect: (result: GeocodingResult) => void;
  /** Optional callback when search input changes */
  onSearchChange?: (query: string) => void;
  /** City bounding box to limit search results */
  boundingBox?: BoundingBox;
  /** Placeholder text */
  placeholder?: string;
  /** Whether to add waypoint on selection (default: false) */
  addWaypointOnSelect?: boolean;
  /** CSS class name */
  className?: string;
}

export function AddressSearch({
  onSelect,
  onSearchChange,
  boundingBox,
  placeholder,
  addWaypointOnSelect = false,
  className,
}: AddressSearchProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const { results, isSearching, error, debouncedSearch, clearResults } =
    useGeocoding({
      boundingBox,
      limit: 8,
      debounceMs: 300,
    });

  const handleInputChange = useCallback(
    (value: string) => {
      setInputValue(value);
      onSearchChange?.(value);

      if (value.trim()) {
        setOpen(true);
        debouncedSearch(value);
      } else {
        setOpen(false);
        clearResults();
      }
    },
    [debouncedSearch, clearResults, onSearchChange]
  );

  const handleSelect = useCallback(
    (result: GeocodingResult) => {
      setInputValue(result.displayName);
      setOpen(false);
      clearResults();
      onSelect(result);
    },
    [onSelect, clearResults]
  );

  const handleClear = useCallback(() => {
    setInputValue('');
    setOpen(false);
    clearResults();
  }, [clearResults]);

  const showResults = open && inputValue.trim().length > 0;

  return (
    <div className={className}>
      <Command shouldFilter={false} className="rounded-lg border shadow-md">
        <div className="relative">
          <CommandInput
            placeholder={
              placeholder ||
              t('tourEditor.map.searchAddress', 'Search address...')
            }
            value={inputValue}
            onValueChange={handleInputChange}
            onFocus={() => inputValue.trim() && setOpen(true)}
          />
          {isSearching && (
            <div className="absolute right-10 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
          {inputValue && !isSearching && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
              onClick={handleClear}>
              <X className="h-4 w-4" />
              <span className="sr-only">{t('common.clear', 'Clear')}</span>
            </Button>
          )}
        </div>

        {showResults && (
          <CommandList>
            {error ? (
              <CommandEmpty className="text-destructive">
                {t(
                  'tourEditor.map.geocodingError',
                  'Error searching addresses'
                )}
              </CommandEmpty>
            ) : results.length === 0 && !isSearching ? (
              <CommandEmpty>
                {t('tourEditor.map.noResults', 'No results found')}
              </CommandEmpty>
            ) : (
              <CommandGroup
                heading={
                  addWaypointOnSelect
                    ? t(
                        'tourEditor.map.selectToAddWaypoint',
                        'Select to add waypoint'
                      )
                    : t('tourEditor.map.suggestions', 'Suggestions')
                }>
                {results.map((result, index) => (
                  <CommandItem
                    key={`${result.lat}-${result.lon}-${index}`}
                    value={result.displayName}
                    onSelect={() => handleSelect(result)}
                    className="flex items-start gap-2 py-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {result.displayName.split(',')[0]}
                      </span>
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {result.displayName.split(',').slice(1).join(',')}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        )}
      </Command>
    </div>
  );
}
