"use client";

import { forwardRef, useEffect, useMemo, useState, useRef } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/shadcn-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { smartFilterOptions } from '@/lib/select-utils';

export interface ComboboxProps {
  options: string[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  emptyText?: string;
}

export const Combobox = forwardRef<HTMLButtonElement, ComboboxProps>(
  ({
    options,
    value,
    onValueChange,
    placeholder = "Seleccionar opción...",
    searchPlaceholder = "Buscar...",
    disabled = false,
    className,
    emptyText = "No se encontraron opciones.",
    ...props
  }, ref) => {
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const optionsContainerRef = useRef<HTMLDivElement>(null);

    const filteredOptions = useMemo(() => {
      return smartFilterOptions(options, searchValue);
    }, [options, searchValue]);

    // Reset highlight when options change
    useEffect(() => {
      setHighlightedIndex(-1);
    }, [filteredOptions]);

    // Reset search and highlight when closing
    useEffect(() => {
      if (!open) {
        setSearchValue("");
        setHighlightedIndex(-1);
      } else {
        // Focus search input when opening
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 0);
      }
    }, [open]);

    // Scroll highlighted item into view
    useEffect(() => {
      if (highlightedIndex >= 0 && optionsContainerRef.current) {
        const optionElement = optionsContainerRef.current.children[highlightedIndex] as HTMLElement;
        if (optionElement) {
          optionElement.scrollIntoView({
            block: 'nearest',
            behavior: 'auto'
          });
        }
      }
    }, [highlightedIndex]);

    const handleSelect = (selectedValue: string) => {
      onValueChange(selectedValue);
      setOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onValueChange("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!open) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
          
        case 'Enter':
        case 'Tab':
          e.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleSelect(filteredOptions[highlightedIndex]);
          }
          break;
          
        case 'Escape':
          e.preventDefault();
          setOpen(false);
          break;
      }
    };

    const displayValue = value || placeholder;
    const hasValue = Boolean(value);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            onKeyDown={handleKeyDown}
            className={cn(
              "w-full justify-between h-10 px-3 py-2 text-left font-normal",
              !hasValue && "text-muted-foreground",
              disabled && "cursor-not-allowed opacity-50",
              className
            )}
            {...props}
          >
            <span className="truncate">{displayValue}</span>
            <div className="flex items-center gap-1">
              {hasValue && !disabled && (
                <X
                  className="h-4 w-4 opacity-50 hover:opacity-100"
                  onClick={handleClear}
                />
              )}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          className="w-[var(--radix-popover-trigger-width)] p-0" 
          align="start"
          onKeyDown={handleKeyDown}
        >
          <div className="flex flex-col">
            {/* Campo de búsqueda */}
            <div className="p-2 border-b">
              <Input
                ref={searchInputRef}
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-8"
                autoFocus
              />
            </div>
            
            {/* Lista de opciones con scroll */}
            <div className="max-h-[250px] overflow-y-auto">
              <div ref={optionsContainerRef} className="p-1">
                {filteredOptions.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    {emptyText}
                  </div>
                ) : (
                  filteredOptions.map((option, index) => (
                    <div
                      key={option}
                      className={cn(
                        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                        // Estilo hover normal
                        "hover:bg-accent hover:text-accent-foreground",
                        // Estilo para opción seleccionada (con check)
                        value === option && "bg-accent text-accent-foreground",
                        // Estilo para opción resaltada con teclado (más prominente)
                        highlightedIndex === index && "bg-primary/10 text-primary font-medium"
                      )}
                      onClick={() => handleSelect(option)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      onMouseLeave={() => setHighlightedIndex(-1)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="truncate">{option}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

Combobox.displayName = "Combobox"; 