import { Avatar, CircularProgress, Skeleton, Tooltip } from '@mui/material';

function Contributors({ contributors, setGetAllContributors, getAllContributors }) {
    return (
        <div className={'contributors'}>
            <h4>Contributors</h4>
            {!contributors.isLoading ? (
                <>
                    <div className={'detailPage_contributors_wrapper'}>
                        {contributors.data.map((contributor) => {
                            return (
                                <a key={contributor.id} href={contributor.html_url} target="_blank">
                                    <Tooltip title={contributor.login}>
                                        <Avatar src={contributor.avatar_url} />
                                    </Tooltip>
                                </a>
                            );
                        })}
                    </div>
                    {contributors.hasNextPages ? (
                        getAllContributors ? (
                            <p
                                className={'toggle_contributors_view'}
                                onClick={() => setGetAllContributors(false)}>
                                Hide
                            </p>
                        ) : (
                            <p
                                className={'toggle_contributors_view'}
                                onClick={() => setGetAllContributors(true)}>
                                Show all Contributors
                            </p>
                        )
                    ) : null}
                </>
            ) : (
                <>
                    <div className={'detailPage_contributors_wrapper_skeleton'}>
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="circular" width={40} height={40} />
                    </div>
                    <p className={'toggle_contributors_view'}>
                        <CircularProgress size={20} />
                    </p>
                </>
            )}
        </div>
    );
}

export default Contributors;
