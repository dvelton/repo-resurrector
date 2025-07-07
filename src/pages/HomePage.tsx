import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { GitMerge, ArrowRight, Star, GitPullRequest, Smiley } from "@phosphor-icons/react";
import { Link } from "@/components/ui/navigational";

export function HomePage() {
  const { user, login } = useAuth();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto py-12 px-4">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Revive abandoned
            <span className="text-primary block">open source repositories</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Find promising but abandoned projects and bring them back to life.
            Make an impact on the open source community by rescuing valuable code.
          </p>
          <div className="pt-6 flex justify-center gap-4">
            {user ? (
              <Button asChild size="lg">
                <Link href="/explore" className="gap-2">
                  <GitMerge size={20} />
                  <span>Explore Repositories</span>
                </Link>
              </Button>
            ) : (
              <Button onClick={login} size="lg" className="gap-2">
                <Star size={20} />
                <span>Login with GitHub</span>
              </Button>
            )}
            <Button variant="outline" size="lg" asChild>
              <Link href="/leaderboard" className="gap-2">
                <ArrowRight size={20} />
                <span>View Leaderboard</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-16 px-4">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <Star size={24} weight="duotone" />
              </div>
              <h3 className="text-xl font-medium mb-2">Find Promising Repos</h3>
              <p className="text-muted-foreground">
                Discover valuable repositories that haven't been maintained for a year or more but still have user interest.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4 text-secondary">
                <GitPullRequest size={24} weight="duotone" />
              </div>
              <h3 className="text-xl font-medium mb-2">Adopt & Improve</h3>
              <p className="text-muted-foreground">
                Fork the repository, make improvements guided by AI suggestions, and submit pull requests to revive the project.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 text-accent">
                <Smiley size={24} weight="duotone" />
              </div>
              <h3 className="text-xl font-medium mb-2">Join The Community</h3>
              <p className="text-muted-foreground">
                Connect with other maintainers, earn recognition on the leaderboard, and help sustain open source.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">
            Ready to resurrect some code?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join the community of open source revivalists and make a lasting impact on the software ecosystem.
          </p>
          <Button asChild size="lg" className="mt-4">
            <Link href="/explore" className="gap-2">
              <GitMerge size={20} />
              <span>Start Exploring</span>
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}