import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, Paper, Tooltip } from '@mui/material';
import { ForkRight, Preview, StarBorder, SupervisorAccount, Visibility } from '@mui/icons-material';
import './DetailPage.css';
import UsedLanguages from './UsedLanguages';

function DetailPage() {
    const { owner, repo } = useParams();

    const [initialRepoContent, setInitialRepoContent] = useState({ isLoading: true });
    const [secondaryApis, setSecondaryApis] = useState({});
    const [additionalRepoContent, setAdditionalRepoContent] = useState({
        isLoading: true,
        languages: { isLoading: true, data: {} },
        contributors: { isLoading: true, data: [] },
    });

    useEffect(() => {
        const fetchData = () => {
            instance
                .get(`https://api.github.com/repos/${owner}/${repo}`)
                .then((result) => {
                    if (result.status === 200) {
                        const repo = result.data;

                        const repoContent = {
                            fullName: repo.full_name,
                            repoUrl: repo.html_url,
                            forks: repo.forks,
                            subscribersCount: repo.subscribers_count,
                            visibility: repo.visibility,
                            watchers: repo.watchers_count,
                            stars: repo.stargazers_count,
                            publishDate: repo.created_at,
                            updateDate: repo.updated_at,
                            owner: {
                                avatar: repo.owner.avatar_url,
                                profileUrl: repo.owner.html_url,
                                userName: repo.owner.login,
                            },
                        };

                        setInitialRepoContent((curState) => {
                            return {
                                ...curState,
                                isLoading: false,
                                ...repoContent,
                            };
                        });

                        setSecondaryApis({
                            languages: repo.languages_url,
                            contributors: repo.contributors_url,
                        });
                    }
                })
                .catch((err) => console.log(err));
        };
        fetchData();
    }, [owner, repo]);

    useEffect(() => {
        if (Object.keys(secondaryApis).length) {
            const getLanguages = () => {
                return instance
                    .get(secondaryApis.languages)
                    .then((result) => {
                        if (result.status === 200) {
                            setAdditionalRepoContent((curState) => {
                                return {
                                    ...curState,
                                    languages: {
                                        ...curState.languages,
                                        data: result.data,
                                        isLoading: false,
                                    },
                                };
                            });
                        }
                    })
                    .catch((err) => console.log(err));
            };
            const getContributors = () => {
                return instance
                    .get(secondaryApis.contributors)
                    .then((result) => {
                        if (result.status === 200) {
                            setAdditionalRepoContent((curState) => {
                                return {
                                    ...curState,
                                    contributors: {
                                        ...curState.contributors,
                                        data: result.data,
                                        isLoading: false,
                                    },
                                };
                            });
                        }
                    })
                    .catch((err) => console.log(err));
            };
            getLanguages();
            getContributors();
        }
    }, [secondaryApis]);

    useEffect(() => {
        if (
            !additionalRepoContent.languages.isLoading &&
            !additionalRepoContent.contributors.isLoading
        ) {
            setAdditionalRepoContent((curState) => {
                return { ...curState, isLoading: false };
            });
        }
    }, [additionalRepoContent.contributors, additionalRepoContent.languages]);

    return (
        <div>
            <Paper className={'detailPage_mainCard_wrapper'} square={false} elevation={6}>
                {!initialRepoContent.isLoading ? (
                    <div>
                        <div className={'detailPage_owner_avatar_container'}>
                            <Avatar
                                className={'detailPage_owner_avatar'}
                                src={initialRepoContent.owner.avatar}
                            />
                            <a href={initialRepoContent.repoUrl} target="_blank">
                                {initialRepoContent.fullName}
                            </a>
                        </div>
                        <Paper variant="outlined" className={'detailPage_details_wrapper'}>
                            <p>Published at: {initialRepoContent.publishDate}</p>
                            <p>Last Update: {initialRepoContent.updateDate}</p>
                            <p>
                                <SupervisorAccount /> {initialRepoContent.subscribersCount}{' '}
                                subscribers
                            </p>
                            <p>
                                <Preview /> {initialRepoContent.visibility} visibility
                            </p>
                            <p>
                                <Visibility /> {initialRepoContent.watchers} watching
                            </p>
                            <p>
                                <StarBorder /> {initialRepoContent.stars} stars
                            </p>
                            <p>
                                <ForkRight /> {initialRepoContent.forks} forks
                            </p>
                        </Paper>
                    </div>
                ) : (
                    <div>Loading</div>
                )}
                {!additionalRepoContent.isLoading ? (
                    <>
                        <UsedLanguages languages={additionalRepoContent.languages.data} />
                        <div className={'detailPage_contributors_wrapper'}>
                            {additionalRepoContent.contributors.data.map((contributor) => {
                                return (
                                    <a
                                        key={contributor.id}
                                        href={contributor.html_url}
                                        target="_blank">
                                        <Tooltip title={contributor.login}>
                                            <Avatar src={contributor.avatar_url} />
                                        </Tooltip>
                                    </a>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    'Loading'
                )}
            </Paper>
        </div>
    );
}
export default DetailPage;

const instance = axios.create({});
