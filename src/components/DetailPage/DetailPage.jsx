import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Avatar, Paper, Skeleton } from '@mui/material';
import {
    ArrowBack,
    ForkRight,
    Preview,
    StarBorder,
    SupervisorAccount,
    Visibility,
} from '@mui/icons-material';
import './DetailPage.css';
import UsedLanguages from './UsedLanguages';
import Contributors from './Contributors';
import ErrorPage from '../ErrorPage/ErrorPage';
import { instance } from '../axiosInstance';

function DetailPage() {
    const navigate = useNavigate();
    const [error, setError] = useState({ isError: false, statusCode: '', message: '' });
    const { owner, repo } = useParams();
    const [initialRepoContent, setInitialRepoContent] = useState({ isLoading: true });
    const [secondaryApis, setSecondaryApis] = useState({});
    const [additionalRepoContent, setAdditionalRepoContent] = useState({
        isLoading: true,
        languages: { isLoading: true, data: {} },
        contributors: { isLoading: true, data: [], hasNextPages: false },
    });
    const [showAllContributors, setShowAllContributors] = useState(false);

    useEffect(() => {
        const fetchData = () => {
            instance
                .get(`https://api.github.com/repos/${owner}/${repo}`)
                .then((response) => {
                    if (response.status === 200) {
                        const repo = response.data;

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
                .catch((err) =>
                    setError((curState) => {
                        return {
                            ...curState,
                            isError: true,
                            statusCode: err.response.status,
                            message: err.response.data.message,
                        };
                    })
                );
        };
        fetchData();
    }, [owner, repo]);

    useEffect(() => {
        if (Object.keys(secondaryApis).length) {
            const getLanguages = () => {
                return instance
                    .get(secondaryApis.languages)
                    .then((response) => {
                        if (response.status === 200) {
                            setAdditionalRepoContent((curState) => {
                                return {
                                    ...curState,
                                    languages: {
                                        ...curState.languages,
                                        data: response.data,
                                        isLoading: false,
                                    },
                                };
                            });
                        }
                    })
                    .catch((err) =>
                        setError((curState) => {
                            return {
                                ...curState,
                                isError: true,
                                statusCode: err.response.status,
                                message: err.response.data.message,
                            };
                        })
                    );
            };

            getLanguages();
        }
    }, [secondaryApis]);

    useEffect(() => {
        if (Object.keys(secondaryApis).length) {
            setAdditionalRepoContent((curState) => {
                return { ...curState, contributors: { ...curState.contributors, isLoading: true } };
            });
            const getAllContributor = () => {
                return instance
                    .get(secondaryApis.contributors, {
                        params: { per_page: showAllContributors ? 0 : 10 },
                    })
                    .then((response) => {
                        if (response.status === 200) {
                            setAdditionalRepoContent((curState) => {
                                return {
                                    ...curState,
                                    contributors: {
                                        ...curState.contributors,
                                        data: response.data,
                                        isLoading: false,
                                        hasNextPages: !!response.headers.link,
                                    },
                                };
                            });
                        }
                    })
                    .catch((err) =>
                        setError((curState) => {
                            return {
                                ...curState,
                                isError: true,
                                statusCode: err.response.status,
                                message: err.response.data.message,
                            };
                        })
                    );
            };
            getAllContributor();
        }
    }, [showAllContributors, secondaryApis]);

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

    if (!error.isError) {
        return (
            <div>
                <Paper className={'detailPage_mainCard_wrapper'} square={false} elevation={6}>
                    {!initialRepoContent.isLoading ? (
                        <div>
                            <span className={'detailPage_arrowHome'} onClick={() => navigate('/')}>
                                <ArrowBack /> Home
                            </span>
                            <div className={'detailPage_owner_avatar_container'}>
                                <Avatar
                                    className={'detailPage_owner_avatar'}
                                    src={initialRepoContent.owner.avatar}
                                />
                                <a
                                    href={initialRepoContent.repoUrl}
                                    target="_blank"
                                    rel="noreferrer">
                                    {initialRepoContent.fullName}
                                </a>
                            </div>
                            <Paper variant="outlined" className={'detailPage_details_wrapper'}>
                                <span>
                                    <b>Published on:</b>
                                    {new Date(initialRepoContent.publishDate).toLocaleDateString()}
                                </span>
                                <span>
                                    <b>Last Update:</b>
                                    {new Date(initialRepoContent.updateDate).toLocaleDateString()}
                                </span>
                                <span style={{ display: 'flex' }}>
                                    <SupervisorAccount /> {initialRepoContent.subscribersCount}{' '}
                                    subscribers
                                </span>
                                <span>
                                    <Preview /> {initialRepoContent.visibility} visibility
                                </span>
                                <span>
                                    <Visibility /> {initialRepoContent.watchers} watching
                                </span>
                                <span>
                                    <StarBorder /> {initialRepoContent.stars} stars
                                </span>
                                <span>
                                    <ForkRight /> {initialRepoContent.forks} forks
                                </span>
                            </Paper>
                        </div>
                    ) : (
                        <div>
                            <div className={'detailPage_owner_avatar_container'}>
                                <Skeleton
                                    className={'detailPage_owner_avatar'}
                                    variant="circular"
                                />
                                <Skeleton variant="text" width={50} />
                            </div>
                            <Paper variant="outlined" className={'detailPage_details_wrapper'}>
                                <Skeleton variant="text" width={'40%'} />
                                <Skeleton variant="text" width={'40%'} />
                                <Skeleton variant="text" width={'40%'} />
                                <Skeleton variant="text" width={'40%'} />
                                <Skeleton variant="text" width={'40%'} />
                                <Skeleton variant="text" width={'40%'} />
                                <Skeleton variant="text" width={'40%'} />
                            </Paper>
                        </div>
                    )}
                    <div>
                        <UsedLanguages languages={additionalRepoContent.languages} />
                        <Contributors
                            setGetAllContributors={setShowAllContributors}
                            getAllContributors={showAllContributors}
                            contributors={additionalRepoContent.contributors}
                        />
                    </div>
                </Paper>
            </div>
        );
    } else {
        return <ErrorPage statusCode={error.statusCode} message={error.message} />;
    }
}

export default DetailPage;
