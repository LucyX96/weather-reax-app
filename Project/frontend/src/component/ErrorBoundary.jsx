import React from 'react';
import PropTypes from 'prop-types';
const isDev = import.meta.env.DEV;

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    // eslint-disable-next-line no-unused-vars
    static getDerivedStateFromError(_error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', border: '1px solid red', borderRadius: '8px', margin: '20px' }}>
                    <h2>Ops! Qualcosa è andato storto.</h2>
                    <p>Si è verificato un errore imprevisto. Riprova più tardi.</p>
                    <button onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}>
                        Riprova
                    </button>
                    {isDev && (
                        <details style={{ whiteSpace: 'pre-wrap' }}>
                            {this.state.error && this.state.error.toString()}
                            <br />
                            {this.state.errorInfo?.componentStack ?? 'Nessuno stack disponibile'}
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ErrorBoundary;