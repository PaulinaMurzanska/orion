import React, { useEffect, useRef, useState } from 'react';
import {
  StyledFilterSelect,
  StyledInput,
  StyledInputWrapper,
  StyledMagnifier,
  StyledSearchesContainer,
  StyledSelectItem,
  StyledSelectLabel,
} from './StyledCustomSelect';

import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { SelectOptionType } from './type';

interface SelectProps {
  options: SelectOptionType[];
  getSelectedOption: (option: SelectOptionType) => void;
}

const CustomSelect = ({ options, getSelectedOption }: SelectProps) => {
  const [search, setSearch] = useState<string>('');
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [showResults, setShowResults] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Array<HTMLDivElement | null>>([]);

  const [filteredOptions, setFilteredOptions] =
    useState<SelectOptionType[]>(options);

  const filterOptions = (value: string | undefined) => {
    if (value) {
      const filtered = options.filter((option) =>
        option.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  };

  const handleInputKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      setShowResults(!showResults);
    } else if (event.key === 'ArrowDown') {
      if (!showResults && filteredOptions.length > 0) {
        setShowResults(true);
        if (optionRefs.current[0]) optionRefs.current[0].focus();
      } else {
        const currentIndex = optionRefs.current.findIndex(
          (ref) => ref === document.activeElement
        );
        if (currentIndex < filteredOptions.length - 1) {
          optionRefs.current[currentIndex + 1]?.focus();
        }
      }
    } else if (event.key === 'ArrowUp') {
      const currentIndex = optionRefs.current.findIndex(
        (ref) => ref === document.activeElement
      );
      if (currentIndex > 0) {
        optionRefs.current[currentIndex - 1]?.focus();
      } else if (currentIndex === 0) {
        inputRef.current?.focus();
      }
    }
  };

  const handleOptionKeyPress = (
    event: React.KeyboardEvent<HTMLDivElement>,
    index: number
  ) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = index < filteredOptions.length - 1 ? index + 1 : 0;
      optionRefs.current[nextIndex]?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (index === 0) {
        inputRef.current?.focus();
      } else {
        const prevIndex = index > 0 ? index - 1 : filteredOptions.length - 1;
        optionRefs.current[prevIndex]?.focus();
      }
    } else if (event.key === 'Enter') {
      setShowResults(false);
      setSelectedValue(filteredOptions[index].name);
      setSearch(filteredOptions[index].name);
      getSelectedOption(filteredOptions[index]);
      setShowResults(false);
      inputRef.current?.focus();
    }
  };

  const handleOptionClick = (option: SelectOptionType) => {
    if (option) {
      setSelectedValue(option.name);
      setSearch(option.name);
      getSelectedOption(option);
      setShowResults(false);
      inputRef.current?.focus();
      setShowResults(false);
    }
  };

  useEffect(() => {
    filterOptions(search);
    setShowResults(!!(search && search.trim().length > 0));
    if (search.length === 0) {
      getSelectedOption({ icon: null, value: '', name: '', id: null });
    }
  }, [search]);

  return (
    <StyledFilterSelect>
      <StyledInputWrapper
        showResults={showResults}
        onClick={() => setShowResults(!showResults)}
        onKeyDown={handleInputKeyPress}
      >
        <StyledMagnifier>
          <MagnifyingGlassIcon className="text-zinc-500" />
        </StyledMagnifier>
        <StyledInput
          type="text"
          placeholder="Filter"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          ref={inputRef}
        />
      </StyledInputWrapper>
      <StyledSearchesContainer showResults={showResults}>
        {filteredOptions &&
          filteredOptions.map((option: any, index: number) => (
            <StyledSelectItem
              key={index}
              ref={(ref) => (optionRefs.current[index] = ref)}
              tabIndex={0}
              onKeyDown={(e) => handleOptionKeyPress(e, index)}
              onClick={() => handleOptionClick(option)}
            >
              {option.icon && option.icon}
              <StyledSelectLabel>{option.name}</StyledSelectLabel>
            </StyledSelectItem>
          ))}
      </StyledSearchesContainer>
    </StyledFilterSelect>
  );
};

export default CustomSelect;
