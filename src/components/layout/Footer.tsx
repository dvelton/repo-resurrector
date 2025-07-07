import { Link } from "@/components/ui/navigational";
import { GithubLogo } from "@phosphor-icons/react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container flex flex-col md:flex-row items-center justify-between py-6 gap-4">
        <div className="flex items-center gap-2">
          <GithubLogo weight="duotone" size={20} className="text-primary" />
          <p className="text-sm text-muted-foreground">
            Dead Repo Resurrector - Reviving abandoned open source repositories
          </p>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/about" className="hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="/faq" className="hover:text-foreground transition-colors">
            FAQ
          </Link>
          <Link 
            href="https://github.com"
            external
            className="hover:text-foreground transition-colors flex items-center gap-1"
          >
            <GithubLogo size={16} />
            <span>GitHub</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}