import { createContext, useContext, useEffect, useState } from 'react';

import type { Session } from '@checkout/contracts';

import { restoreSession } from '@/entities/session/api/restore-session';
import { Loader, Typography } from '@/shared/ui';

interface SessionContextValue {
  session: Session;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    restoreSession().then(setSession).catch(setError);
  }, []);

  if (error) {
    return (
      <main>
        <Typography variant="danger">{error.message}</Typography>
      </main>
    );
  }

  if (!session) {
    return <Loader />;
  }

  return <SessionContext.Provider value={{ session }}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }

  return context;
}
