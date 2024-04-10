import { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, Pagination, Skeleton } from '@mui/material';
import { colors } from '../DetailPage/UsedLanguages';
import { useNavigate } from 'react-router-dom';

const itemPerPage = 27;

function RepositoryList({ searchInput, isLayoutTabular }) {
    const navigate = useNavigate();
    const [repositoryList, setRepositoryList] = useState({
        isLoading: true,
        data: [],
        repositoryNotFound: false,
    });

    const [pagination, setPagination] = useState({
        perPage: itemPerPage,
        totalPages: 0,
        curPage: 1,
    });

    useEffect(() => {
        if (searchInput) {
            setRepositoryList((curState) => {
                return { ...curState, isLoading: true };
            });
            const getRepositories = () => {
                axios
                    .get('https://api.github.com/search/repositories', {
                        params: {
                            q: searchInput,
                            per_page: pagination.perPage,
                            page: pagination.curPage,
                        },
                    })
                    .then((response) => {
                        if (response.status === 200) {
                            setRepositoryList((curState) => {
                                return {
                                    ...curState,
                                    isLoading: false,
                                    data: response.data.items,
                                    ...(response.data.total_count <= 0
                                        ? { repositoryNotFound: true }
                                        : {}),
                                };
                            });
                            setPagination((curState) => {
                                return {
                                    ...curState,
                                    totalPages:
                                        response.data.total_count % pagination.perPage > 0
                                            ? parseInt(
                                                  response.data.total_count / pagination.perPage
                                              ) + 1
                                            : response.data.total_count / pagination.perPage,
                                };
                            });
                        }
                    })
                    .catch((err) => console.log(err));
            };
            getRepositories();
        } else {
            setRepositoryList((curState) => {
                return { ...curState, isLoading: false, data: [], repositoryNotFound: false };
            });
            setPagination({ perPage: itemPerPage, totalPages: 0, curPage: 1 });
        }
    }, [searchInput, pagination.curPage]);

    return (
        <div className={'landing_page_repositoryList_wrapper' + isLayoutTabular}>
            {!repositoryList.isLoading ? (
                !repositoryList.repositoryNotFound ? (
                    repositoryList.data.map((repo) => (
                        <div
                            key={repo.id}
                            className={'landing_page_repositoryList_item' + isLayoutTabular}
                            onClick={() =>
                                navigate(`/repository/${repo.owner.login}/${repo.name}`)
                            }>
                            <Avatar
                                className={'landing_page_owner_avatar' + isLayoutTabular}
                                src={repo.owner.avatar_url}
                            />
                            <span className={'landing_page_repoName' + isLayoutTabular}>
                                {repo.name}{' '}
                                {repo.language ? (
                                    <span style={{ backgroundColor: colors[repo.language] }}>
                                        {repo.language}
                                    </span>
                                ) : null}
                            </span>
                            <div className={'landing_page_repoDescription' + isLayoutTabular}>
                                <span>{repo.description}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={'landing_page_notFound'}>No Repository Found</div>
                )
            ) : (
                <>
                    {new Array(pagination.perPage).fill('').map((_, index) => (
                        <>
                            <Skeleton
                                key={index}
                                className={
                                    'landing_page_repositoryList_item_skeleton' + isLayoutTabular
                                }
                            />
                        </>
                    ))}
                </>
            )}
            {pagination.totalPages >= 1 ? (
                <div className={'landing_page_pagination_wrapper'}>
                    <Pagination
                        count={pagination.totalPages}
                        onChange={(e, page) =>
                            setPagination((curState) => {
                                return { ...curState, curPage: page };
                            })
                        }
                    />
                </div>
            ) : null}
        </div>
    );
}

export default RepositoryList;
