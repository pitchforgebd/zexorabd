import { usePageTitleSync } from '../lib/usePageMeta';

/** No UI - just keeps document.title in sync with the current route. Must be mounted inside <Router>. */
export default function RouteTitleSync() {
  usePageTitleSync();
  return null;
}
