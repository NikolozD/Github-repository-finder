import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Avatar } from '@mui/material';
import { colors } from '../DetailPage/UsedLanguages';

function RepositoryList({ searchInput }) {
    const [repositoryList, setRepositoryList] = useState({ isLoading: true, data: [] });
    const [totalPages, setTotalPages] = useState(0);

    const itemsPerPage = useMemo(() => 10, []);

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
                            per_page: 10,
                        },
                    })
                    .then((response) => {
                        if (response.status === 200) {
                            setRepositoryList((curState) => {
                                return { ...curState, isLoading: false, data: response.data.items };
                            });
                            setTotalPages(
                                response.data.total_count % 10 > 0
                                    ? response.data.total_count / 10 + 1
                                    : response.data.total_count / 10
                            );
                        }
                    })
                    .catch((err) => console.log(err));
            };
            getRepositories();
        } else {
            setRepositoryList((curState) => {
                return { ...curState, isLoading: false, data: [] };
            });
        }
    }, [searchInput]);

    return (
        <div className={'landing_page_repositoryList_wrapper'}>
            {!repositoryList.isLoading
                ? repositoryList.data.map((repo) => (
                      <div className={'landing_page_repositoryList_item'}>
                          <Avatar
                              className={'landing_page_owner_avatar'}
                              src={repo.owner.avatar_url}
                          />
                          <span className={'landing_page_repoName'}>
                              {repo.name}{' '}
                              {repo.language ? (
                                  <span style={{ backgroundColor: colors[repo.language] }}>
                                      {repo.language}
                                  </span>
                              ) : null}
                          </span>
                          <div className={'landing_page_repoDescription'}>
                              <span>{repo.description}</span>
                          </div>
                      </div>
                  ))
                : 'asdf'}
        </div>
    );
}

export default RepositoryList;
