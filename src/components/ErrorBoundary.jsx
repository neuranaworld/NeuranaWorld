import { Component } from 'react';
import logger from '../utils/logger';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to our logging service
    logger.error('Error caught by ErrorBoundary', {
      error: error.toString(),
      errorInfo: errorInfo.componentStack,
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div style={{
          padding: '2rem',
          maxWidth: '600px',
          margin: '2rem auto',
          backgroundColor: '#fee',
          border: '2px solid #c33',
          borderRadius: '8px',
          fontFamily: 'system-ui, sans-serif',
        }}>
          <h2 style={{ color: '#c33', marginTop: 0 }}>⚠️ Bir hata oluştu</h2>
          <p>Üzgünüz, bir şeyler yanlış gitti. Lütfen sayfayı yenilemeyi deneyin.</p>

          {import.meta.env.DEV && this.state.error && (
            <details style={{ marginTop: '1rem', fontSize: '0.9em' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Hata Detayları (Geliştirme Modu)
              </summary>
              <pre style={{
                marginTop: '0.5rem',
                padding: '1rem',
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '0.85em',
              }}>
                {this.state.error.toString()}
                {'\n\n'}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}

          <button
            onClick={this.handleReset}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Tekrar Dene
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
