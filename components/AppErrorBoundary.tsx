import React from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
};

export class AppErrorBoundary extends React.Component<Props, State> {
  static contextType = LanguageContext;
  declare props: Readonly<Props>;
  declare context: React.ContextType<typeof LanguageContext>;

  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Application render failed:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const t = this.context?.t ?? ((key: string) => {
        const fallbackCopy: Record<string, string> = {
          app_error_label: 'Application Error',
          app_error_title: 'The page failed to load.',
          app_error_desc: 'A runtime error interrupted rendering. Reload the page to retry.',
          app_error_reload: 'Reload page',
        };

        return fallbackCopy[key] ?? key;
      });

      return (
        <div className="min-h-screen bg-slate-50 px-6 py-20 text-slate-900">
          <div className="mx-auto max-w-2xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              {t('app_error_label')}
            </p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-950">
              {t('app_error_title')}
            </h1>
            <p className="mt-4 leading-relaxed text-slate-600">
              {t('app_error_desc')}
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="mt-6 inline-flex items-center justify-center rounded-full border border-accent-400/30 bg-[linear-gradient(145deg,#071427_0%,#0d2747_58%,#123765_100%)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              {t('app_error_reload')}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
