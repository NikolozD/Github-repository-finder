import './ErrorPage.css';

function ErrorPage({ statusCode, message }) {
    return (
        <div className={'error_page_wrapper'}>
            <p className={'error_page_statusCode'}>{statusCode}</p>
            <p className={'error_page_message'}>{message}</p>
        </div>
    );
}
export default ErrorPage;
