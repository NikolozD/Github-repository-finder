import { InputAdornment, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import './LandingPage.css';
import { Search, ViewList, ViewModule } from '@mui/icons-material';
import { useCallback, useEffect, useState } from 'react';
import RepositoryList from './RepositoryList';
import useDebounce from '../DetailPage/useDebounce';

function LandingPage() {
    const [searchInputValue, setSearchInputValue] = useState('');
    const [view, setView] = useState('list');
    const debouncedValue = useDebounce(searchInputValue);

    const handleLayoutChange = useCallback((event, value) => {
        setView(value);
    }, []);

    const handleInput = useCallback((value) => {
        setSearchInputValue(value);
    }, []);

    useEffect(() => {
        const url = new URL(window.location.href);
        const searchParams = url.searchParams.get('q');

        setSearchInputValue(searchParams ?? '');
    }, []);

    return (
        <div className={'landing_page_wrapper'}>
            <div className={'landing_page_searchField_wrapper'}>
                <TextField
                    className={'landing_page_searchField'}
                    id="outlined-search"
                    onChange={(e) => handleInput(e.target.value)}
                    value={searchInputValue}
                    type="search"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                    placeholder="Search for Repository"
                    multiline
                />
                <ToggleButtonGroup
                    className={'landing_page_viewToggleGroup'}
                    value={view}
                    exclusive
                    onChange={handleLayoutChange}>
                    <ToggleButton value="list" aria-label="list">
                        <ViewList />
                    </ToggleButton>
                    <ToggleButton value="module" aria-label="module">
                        <ViewModule />
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
            <RepositoryList searchInput={debouncedValue} isLayoutTabular={isLayoutTabular(view)} />
        </div>
    );
}

export default LandingPage;

const isLayoutTabular = (view) => {
    return view === 'list' ? ' tabular' : '';
};
