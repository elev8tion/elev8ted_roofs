import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './AddressAutocomplete.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface Suggestion {
  description: string;
  place_id: string;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (address: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  disabled = false,
  placeholder = '123 Main St, City, State ZIP'
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch suggestions when input changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (value.length < 3) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/v1/autocomplete/suggestions`, {
          params: { input: value }
        });

        if (response.data.success && response.data.suggestions.length > 0) {
          setSuggestions(response.data.suggestions);
          setShowDropdown(true);
        } else {
          setSuggestions([]);
          setShowDropdown(false);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
        setShowDropdown(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300); // Debounce
    return () => clearTimeout(timer);
  }, [value]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (suggestion: Suggestion) => {
    onChange(suggestion.description);
    onSelect(suggestion.description);
    setShowDropdown(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        break;
    }
  };

  return (
    <div className="autocomplete-container" ref={dropdownRef}>
      <input
        ref={inputRef}
        type="text"
        className="input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
        disabled={disabled}
      />

      {showDropdown && suggestions.length > 0 && (
        <div className="autocomplete-dropdown">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.place_id}
              className={`autocomplete-item ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => handleSelect(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <span className="location-icon">📍</span>
              <span className="suggestion-text">{suggestion.description}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
