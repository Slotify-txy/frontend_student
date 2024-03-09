import React from 'react'
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, TextField } from '@mui/material';

export const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.black, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.black, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-root': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '30ch',
            '&:focus': {
                width: '40ch',
            },
        },
    },
}));


export const CoachSearch = ({ setIsSearchingCoach }) => {

    // todo: get real coaches
    const coaches = [
        { title: 'The Shawshank Redemption', year: 1994 },
        { title: 'The Godfather', year: 1972 },
        { title: 'The Godfather: Part II', year: 1974 },
        { title: 'The Dark Knight', year: 2008 },
    ]

    return (
        <>
            <Search>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <Autocomplete
                    freeSolo
                    id="free-solo-2-demo"
                    disableClearable
                    openOnFocus
                    options={coaches.map((option) => option.title)}
                    onChange={(event, value) => {
                        console.log(value)
                        setIsSearchingCoach(false)
                    }}
                    renderInput={(params) =>
                        <StyledTextField
                            {...params}
                            autoFocus
                            inputProps={{
                                ...params.inputProps,
                                onBlur: () => setIsSearchingCoach(false)
                            }}
                            InputProps={{
                                ...params.InputProps,
                                type: 'search',
                            }}
                            placeholder='Switch Coach'
                        />
                    }
                />

            </Search>
        </>
    )
}
