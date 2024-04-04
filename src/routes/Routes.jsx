import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage from '../components/LandingPage/LandingPage';
import DetailPage from '../components/DetailPage/DetailPage';
import DetailErrorPage from '../components/DetailPage/DetailErrorPage';

const Routes = () => {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <LandingPage />,
            errorElement: <DetailErrorPage />,
        },
        {
            path: 'repository/:repositoryId',
            element: <DetailPage />,
        },
    ]);

    return <RouterProvider router={router} />;
};

export default Routes;
