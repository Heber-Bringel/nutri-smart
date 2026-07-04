import { useState, useEffect, createContext, useContext, ReactNode, createElement } from 'react';
import { User } from '../../model/entities/User';
import { Container } from '../../di/container';
import { LoginCredentials, RegisterData } from '../../model/services/IAuthService';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Busca usuário atual ao carregar
    Container.getCurrentUserUseCase.execute()
      .then((currentUser) => {
        setUser(currentUser);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });

    // Subscrição para alterações no estado de autenticação
    const unsubscribe = Container.authService.onAuthStateChange((updatedUser) => {
      setUser(updatedUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const loggedUser = await Container.loginUseCase.execute(credentials);
      setUser(loggedUser);
      return loggedUser;
    } catch (err: any) {
      const errorMessage = err?.message || 'E-mail ou senha inválidos.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const registeredUser = await Container.registerUseCase.execute(data);
      setUser(registeredUser);
      return registeredUser;
    } catch (err: any) {
      const errorMessage = err?.message || 'Erro ao realizar cadastro.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await Container.authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return createElement(
    AuthContext.Provider,
    { value: { user, loading, error, login, register, logout, clearError } },
    children
  );
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
