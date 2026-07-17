export default function Loader({ isLoading }) {
    return isLoading && <span className="custom-spinner"></span>;
}
