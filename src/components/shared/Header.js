import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header>
      <nav>
        <Link href="/">Home</Link>
        {user ? (
          <>
            <span>{user.email}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;