import { SessionProvider } from './providers/session-provider';
import { AppRouter } from '@/app/router/router';

function App() {
  return (
    <SessionProvider>
      <AppRouter />
    </SessionProvider>
  );
}

export default App;
