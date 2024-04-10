import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage from '../components/LandingPage/LandingPage';
import DetailPage from '../components/DetailPage/DetailPage';
import ErrorPage from '../components/ErrorPage/ErrorPage';

const Routes = () => {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <LandingPage />,
            errorElement: <ErrorPage statusCode={404} message={'Page Not Found'} />,
        },
        {
            path: 'repository/:owner/:repo',
            element: <DetailPage />,
        },
    ]);

    return <RouterProvider router={router} />;
};

export default Routes;
