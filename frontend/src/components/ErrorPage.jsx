import React from 'react';

class ErrorPage extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true }; // Triggers the fallback UI
    }

    componentDidCatch(error, errorInfo) {
        console.error("App Crash:", error, errorInfo);
    }

    render() {
        if (!this.state.hasError) return this.props.children;

        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
                <span className="text-6xl mb-4">🚧</span>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
                <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-full font-medium"
                >
                    Reload Page
                </button>
            </div>
        );
    }
}

export default ErrorPage;
