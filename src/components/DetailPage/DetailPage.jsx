import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function DetailPage() {
    const { owner, repo } = useParams();

    const [initialRepoContent, setInitialRepoContent] = useState({ loading: true });
    const [secondaryApis, setSecondaryApis] = useState({});
    const [additionalRepoContent, setAdditionalRepoContent] = useState({});

    useEffect(() => {
        const fetchData = () => {
            axios.get(`https://api.github.com/repos/${owner}/${repo}`).then((result) => {
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
                            loading: false,
                            ...repoContent,
                        };
                    });

                    setSecondaryApis({
                        languages: repo.languages_url,
                        contributors: repo.contributors_url,
                    });
                }
            });
        };
        fetchData();
    }, [owner, repo]);

    useEffect(() => {
        if (Object.keys(secondaryApis).length) {
            const languages = () => {
                axios.get(secondaryApis.languages).then((result) => {
                    if (result.status === 200) {
                        setAdditionalRepoContent((curState) => {
                            return { ...curState, languages: result.data };
                        });
                    }
                });
            };
            const contributors = () => {
                axios.get(secondaryApis.contributors).then((result) => {
                    if (result.status === 200) {
                        setAdditionalRepoContent((curState) => {
                            return { ...curState, contributors: result.data };
                        });
                    }
                });
            };

            languages();
            contributors();
        }
    }, [secondaryApis]);

    return (
        <div>
            {!initialRepoContent.loading ? (
                <div>
                    <p>fullName: {initialRepoContent.fullName}</p>
                    <p>repoUrl: {initialRepoContent.repoUrl}</p>
                    <p>forks: {initialRepoContent.forks}</p>
                    <p>subscribersCount: {initialRepoContent.subscribersCount}</p>
                    <p>visibility: {initialRepoContent.visibility}</p>
                    <p>watchers: {initialRepoContent.watchers}</p>
                    <p>stars: {initialRepoContent.stars}</p>
                    <p>publishDate: {initialRepoContent.publishDate}</p>
                    <p>updateDate: {initialRepoContent.updateDate}</p>
                    <img
                        src={initialRepoContent.owner.avatar ? initialRepoContent.owner.avatar : ''}
                    />
                </div>
            ) : (
                <div>Loading</div>
            )}
            {Object.keys(additionalRepoContent).length ? (
                <div>
                    <div>
                        {additionalRepoContent.contributors
                            ? additionalRepoContent.contributors[0].login
                            : ''}
                    </div>
                    <div>
                        {additionalRepoContent.languages
                            ? additionalRepoContent.languages.TypeScript
                            : ''}
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default DetailPage;
