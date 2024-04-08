import { useEffect, useState } from 'react';

function useDebounce(searchValue) {
    const [debouncedValue, setDebouncedValue] = useState(searchValue);
    useEffect(() => {
        const debounce = setTimeout(() => {
            setDebouncedValue(searchValue);
        }, 1000);

        return () => {
            clearTimeout(debounce);
        };
    }, [searchValue]);
    return debouncedValue;
}

export default useDebounce;
