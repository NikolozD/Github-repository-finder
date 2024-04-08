import { InputAdornment, TextField } from '@mui/material';
import './LandingPage.css';
import { Search } from '@mui/icons-material';
import { useCallback, useState } from 'react';
import RepositoryList from './RepositoryList';
import useDebounce from '../DetailPage/useDebounce';

function LandingPage() {
    const [searchInputValue, setSearchInputValue] = useState('');
    const [layout, setLayout] = useState('list');
    const debouncedValue = useDebounce(searchInputValue);

    const handleLayoutChange = useCallback((event, value) => {
        setLayout(value);
    }, []);

    const handleInput = useCallback((value) => {
        setSearchInputValue(value);
    }, []);

    return (
        <div className={'landing_page_wrapper'}>
            <div className={'landing_page_searchField_wrapper'}>
                <TextField
                    className={'landing_page_searchField'}
                    id="outlined-search"
                    onChange={(e) => handleInput(e.target.value)}
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
                {/*<ToggleButtonGroup*/}
                {/*    className={'landing_page_viewToggleGroup'}*/}
                {/*    orientation="vertical"*/}
                {/*    value={layout}*/}
                {/*    exclusive*/}
                {/*    onChange={handleLayoutChange}>*/}
                {/*    <ToggleButton value="list" aria-label="list">*/}
                {/*        <ViewList />*/}
                {/*    </ToggleButton>*/}
                {/*    <ToggleButton value="module" aria-label="module">*/}
                {/*        <ViewModule />*/}
                {/*    </ToggleButton>*/}
                {/*</ToggleButtonGroup>*/}
            </div>
            <RepositoryList searchInput={debouncedValue} />
        </div>
    );
}

export default LandingPage;
