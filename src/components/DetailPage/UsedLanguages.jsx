import { useEffect, useState } from 'react';
import './DetailPage.css';
import { Tooltip } from '@mui/material';

function UsedLanguages({ languages }) {
    const [languagesPrct, setLanguagesPrct] = useState({ isLoading: true, data: {} });

    useEffect(() => {
        let languageSum = 0;
        let tempLanguages = {};

        for (let language in languages) {
            languageSum += languages[language];
        }
        for (let language in languages) {
            tempLanguages = {
                ...tempLanguages,
                ...((languages[language] / languageSum) * 100 > 1
                    ? { [language]: ((languages[language] / languageSum) * 100).toFixed(1) }
                    : {
                          Other: tempLanguages.Other
                              ? (
                                    parseFloat(tempLanguages.Other) +
                                    (languages[language] / languageSum) * 100
                                ).toFixed(1)
                              : ((languages[language] / languageSum) * 100).toFixed(1),
                      }),
            };
        }
        console.log(tempLanguages);
        setLanguagesPrct((curState) => {
            return { ...curState, isLoading: false, data: { ...tempLanguages } };
        });
    }, [languages]);

    if (!languagesPrct.isLoading) {
        return (
            <div className={'usedLanguages'}>
                <h4 className={'usedLanguages_title'}>Languages</h4>
                <span className={'usedLanguages_progress_container'}>
                    {Object.keys(languagesPrct.data).map((language) => (
                        <Tooltip title={language}>
                            <span
                                className={'usedLanguages_item'}
                                style={{
                                    flex: `1 1 ${languagesPrct.data[language] + '%'}`,
                                    backgroundColor: colors[language] ?? '#197319',
                                    outline: '2px solid #0000',
                                }}
                                key={language}></span>
                        </Tooltip>
                    ))}
                </span>
                <div className={'usedLanguages_names_container'}>
                    {Object.keys(languagesPrct.data).map((language) => (
                        <span className={'usedLanguages_names_item'} key={language}>
                            <span
                                style={{ backgroundColor: colors[language] ?? '#197319' }}
                                className={'usedLanguages_name_marker'}></span>
                            {language + ' ' + languagesPrct.data[language] + '%'}
                        </span>
                    ))}
                </div>
            </div>
        );
    }
}

export default UsedLanguages;

const colors = {
    JavaScript: '#FF6347', // Tomato
    Python: '#4682B4', // Steel Blue
    Java: '#32CD32', // Lime Green
    'C#': '#FF8C00', // Dark Orange
    C: '#FF31B4',
    'C++': '#FFD700', // Gold
    PHP: '#008080', // Teal
    Ruby: '#800080', // Purple
    Swift: '#20B2AA', // Light Sea Green
    TypeScript: '#9370DB', // Medium Purple
    Kotlin: '#2E8B57', // Sea Green
    Rust: '#BA55D3', // Medium Orchid
    Go: '#FF4500', // Orange Red
    Scala: '#191970', // Midnight Blue
    Perl: '#CD5C5C', // Indian Red
    Haskell: '#00CED1', // Dark Turquoise
    Lua: '#8B008B', // Dark Magenta
    Dart: '#808000', // Olive
    R: '#8B4513', // Saddle Brown
    Assembly: '#800000', // Maroon
    Shell: '#006400', // Dark Green
    'Objective-C': '#DC143C', // Crimson
    Julia: '#FFA07A', // Light Salmon
    Groovy: '#6A5ACD', // Slate Blue
    D: '#00FFFF', // Aqua
    Elixir: '#ADFF2F', // Green Yellow
    Clojure: '#556B2F', // Dark Olive Green
    Ada: '#FFDAB9', // Peach Puff (light)
    'F#': '#FFE4B5', // Moccasin (light)
    Erlang: '#F0E68C', // Khaki (light)
    PowerShell: '#FF69B4', // Hot Pink (light)
    COBOL: '#FFC0CB', // Pink (light)
    Prolog: '#FFA07A', // Light Salmon (duplicate) -> Light Salmon
    Forth: '#FFFF00', // Yellow (light)
    RPG: '#ADD8E6', // Light Blue (light)
    Verilog: '#FF69B4', // Hot Pink (duplicate) -> Hot Pink
    ABAP: '#F0E68C', // Khaki (light)
    Scheme: '#FFDAB9', // Peach Puff (light)
    Bash: '#FFE4B5', // Moccasin (light)
    'Objective-C++': '#F0E68C', // Khaki (duplicate) -> Khaki
    'Vim script': '#FFFF00', // Yellow (duplicate) -> Yellow
    Racket: '#ADD8E6', // Light Blue (duplicate) -> Light Blue
    SQL: '#FFC0CB', // Pink (duplicate) -> Pink
    Dylan: '#556B2F', // Dark Olive Green (duplicate) -> Dark Olive Green
    Smalltalk: '#CD5C5C', // Indian Red (duplicate) -> Indian Red
    Other: '#636363',
};
