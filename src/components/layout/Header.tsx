import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MagnifyingGlass, SignIn, SignOut } from "@phosphor-icons/react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "@/components/ui/navigational";

export function Header() {
  const { user, login, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <MagnifyingGlass weight="duotone" size={24} className="text-primary mr-2" />
            <h1 className="text-xl font-bold">
              <Link href="/" className="flex items-center">
                Dead Repo Resurrector
              </Link>
            </h1>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/explore" className="font-medium transition-colors hover:text-primary">
            Explore
          </Link>
          <Link href="/leaderboard" className="font-medium transition-colors hover:text-primary">
            Leaderboard
          </Link>
          <Link href="/adopted" className="font-medium transition-colors hover:text-primary">
            My Adoptions
          </Link>
        </nav>
        
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm hidden md:block">{user.login}</span>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatarUrl} alt={user.login} />
                <AvatarFallback>{user.login.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon" onClick={logout}>
                <SignOut className="h-5 w-5" />
                <span className="sr-only">Sign Out</span>
              </Button>
            </div>
          ) : (
            <Button onClick={login} variant="default" className="gap-2">
              <SignIn className="h-4 w-4" />
              <span>Login with GitHub</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}