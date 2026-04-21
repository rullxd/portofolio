import { useEffect, useState } from 'react';
import { Github, GitBranch, Star, Users, Zap, ExternalLink, Code2, GitFork, Calendar } from 'lucide-react';

const GitHubStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const githubUsername = import.meta.env.VITE_GITHUB_USERNAME || 'rullxd';
    const githubToken = import.meta.env.VITE_GITHUB_TOKEN;

    useEffect(() => {
        const fetchGitHubData = async () => {
            try {
                const headers = {
                    'User-Agent': 'Syachrul-Portfolio',
                    ...(githubToken && { 'Authorization': `token ${githubToken}` })
                };

                // Fetch user data
                const userResponse = await fetch(`https://api.github.com/users/${githubUsername}`, { headers });
                if (!userResponse.ok) throw new Error('Failed to fetch GitHub user data');
                const userData = await userResponse.json();

                // Fetch repos
                const reposResponse = await fetch(
                    `https://api.github.com/users/${githubUsername}/repos?sort=stars&order=desc&per_page=100`,
                    { headers }
                );
                if (!reposResponse.ok) throw new Error('Failed to fetch GitHub repos');
                const reposData = await reposResponse.json();

                // Calculate stats
                const totalStars = reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0);
                const totalForks = reposData.reduce((sum, repo) => sum + repo.forks_count, 0);
                const languages = {};
                reposData.forEach(repo => {
                    if (repo.language) {
                        languages[repo.language] = (languages[repo.language] || 0) + 1;
                    }
                });

                // Get contribution statistics
                const now = new Date();
                const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                const totalCommits = reposData.reduce((sum, repo) => sum + (repo.size || 0), 0);

                // Get top repos (by stars, excluding forks)
                const topRepos = reposData
                    .filter(repo => repo.stargazers_count > 0)
                    .sort((a, b) => b.stargazers_count - a.stargazers_count)
                    .slice(0, 6);

                setStats({
                    user: userData,
                    repos: reposData,
                    topRepos,
                    totalStars,
                    totalForks,
                    totalCommits,
                    languages: Object.entries(languages)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 5)
                        .map(([lang, count]) => ({ lang, count })),
                });
            } catch (err) {
                console.error('GitHub fetch error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGitHubData();
    }, [githubUsername]);

    if (loading)
        return (
            <div className="text-center text-gray-400">
                <p>Loading GitHub stats...</p>
            </div>
        );

    if (error)
        return (
            <div className="text-center text-red-400">
                <p>Error loading GitHub data: {error}</p>
            </div>
        );

    if (!stats)
        return (
            <div className="text-center text-gray-400">
                <p>No GitHub data available</p>
            </div>
        );

    return (
        <div className="space-y-12" data-aos="fade-up" data-aos-duration="900">
            {/* GitHub Header */}
            <div className="flex items-center gap-4 mb-8" data-aos="fade-right" data-aos-duration="900">
                <img
                    src={stats.user.avatar_url}
                    alt={stats.user.login}
                    className="w-20 h-20 rounded-full border-2 border-purple-500/50"
                />
                <div>
                    <h3 className="text-2xl font-bold text-white">{stats.user.name}</h3>
                    <p className="text-gray-400">@{stats.user.login}</p>
                    <p className="text-sm text-gray-500 mt-1">{stats.user.bio}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Repositories */}
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-blue-500/50 transition" data-aos="fade-up" data-aos-delay="100">
                    <div className="flex items-center gap-3 mb-2">
                        <GitBranch className="w-5 h-5 text-blue-400" />
                        <span className="text-sm text-gray-400">Repositories</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.user.public_repos}</p>
                </div>

                {/* Stars */}
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-yellow-500/50 transition" data-aos="fade-up" data-aos-delay="200">
                    <div className="flex items-center gap-3 mb-2">
                        <Star className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm text-gray-400">Total Stars</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.totalStars}</p>
                </div>

                {/* Followers */}
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-green-500/50 transition" data-aos="fade-up" data-aos-delay="300">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="w-5 h-5 text-green-400" />
                        <span className="text-sm text-gray-400">Followers</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.user.followers}</p>
                </div>

                {/* Following */}
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-pink-500/50 transition" data-aos="fade-up" data-aos-delay="400">
                    <div className="flex items-center gap-3 mb-2">
                        <Github className="w-5 h-5 text-pink-400" />
                        <span className="text-sm text-gray-400">Following</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.user.following}</p>
                </div>
            </div>

            {/* Contribution Statistics - FEATURE 2 */}
            <div className="space-y-4" data-aos="fade-up" data-aos-delay="150">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Zap className="w-6 h-6 text-yellow-400" />
                    Contribution Stats
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Active Repositories */}
                    <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition" data-aos="zoom-in-up" data-aos-delay="100">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Active Projects</p>
                                <p className="text-4xl font-bold text-white">{stats.repos.filter(r => !r.archived).length}</p>
                            </div>
                            <Code2 className="w-8 h-8 text-purple-400 opacity-50" />
                        </div>
                        <p className="text-xs text-gray-500 mt-3">Non-archived repositories</p>
                    </div>

                    {/* Total Forks */}
                    <div className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition" data-aos="zoom-in-up" data-aos-delay="200">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Total Forks</p>
                                <p className="text-4xl font-bold text-white">{stats.totalForks}</p>
                            </div>
                            <GitFork className="w-8 h-8 text-blue-400 opacity-50" />
                        </div>
                        <p className="text-xs text-gray-500 mt-3">Community contributions</p>
                    </div>

                    {/* Last Updated */}
                    <div className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20 hover:border-green-500/40 transition" data-aos="zoom-in-up" data-aos-delay="300">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Last Update</p>
                                <p className="text-lg font-bold text-white">
                                    {stats.repos.length > 0
                                        ? new Date(stats.repos[0].updated_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })
                                        : 'N/A'
                                    }
                                </p>
                            </div>
                            <Calendar className="w-8 h-8 text-green-400 opacity-50" />
                        </div>
                        <p className="text-xs text-gray-500 mt-3">Most recent activity</p>
                    </div>
                </div>
            </div>

            {/* Top Repositories - FEATURE 7 */}
            <div className="space-y-4" data-aos="fade-up" data-aos-delay="200">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-400" />
                    Top Repositories
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stats.topRepos.length > 0 ? (
                        stats.topRepos.map((repo) => (
                            <a
                                key={repo.id}
                                href={repo.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative overflow-hidden rounded-xl border border-white/10 hover:border-purple-500/50 transition-all duration-300"
                                data-aos="fade-up"
                                data-aos-delay={100 + (stats.topRepos.indexOf(repo) * 100)}
                            >
                                {/* Gradient background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-colors" />

                                <div className="relative p-5 space-y-3">
                                    {/* Header with repo name and link */}
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-lg font-bold text-white group-hover:text-purple-300 transition truncate">
                                                {repo.name}
                                            </h4>
                                            <p className="text-xs text-gray-500 mt-1">{repo.full_name.split('/')[0]}</p>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition flex-shrink-0 mt-1" />
                                    </div>

                                    {/* Description */}
                                    {repo.description && (
                                        <p className="text-sm text-gray-400 line-clamp-2">
                                            {repo.description}
                                        </p>
                                    )}

                                    {/* Language and stats */}
                                    <div className="flex flex-wrap items-center gap-2 pt-2">
                                        {repo.language && (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-white/5 rounded-full text-gray-300 border border-white/10">
                                                <span className="w-2 h-2 rounded-full bg-blue-400" />
                                                {repo.language}
                                            </span>
                                        )}
                                    </div>

                                    {/* Stats footer */}
                                    <div className="flex items-center gap-4 pt-3 border-t border-white/10">
                                        <div className="flex items-center gap-1 text-xs text-yellow-400">
                                            <Star className="w-3 h-3" />
                                            <span className="font-semibold">{repo.stargazers_count}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-blue-400">
                                            <GitFork className="w-3 h-3" />
                                            <span className="font-semibold">{repo.forks_count}</span>
                                        </div>
                                        {repo.open_issues_count > 0 && (
                                            <div className="flex items-center gap-1 text-xs text-green-400 ml-auto">
                                                <span className="font-semibold">{repo.open_issues_count} issues</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </a>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-8 text-gray-400">
                            No public repositories with stars found
                        </div>
                    )}
                </div>
            </div>

            {/* Top Languages */}
            <div data-aos="fade-up" data-aos-delay="150">
                <h4 className="text-lg font-bold text-white mb-4">Top Languages</h4>
                <div className="flex flex-wrap gap-2">
                    {stats.languages.map(({ lang, count }) => (
                        <div
                            key={lang}
                            className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full text-sm text-white hover:from-purple-500/30 hover:to-pink-500/30 transition"
                            data-aos="zoom-in"
                            data-aos-delay="100"
                        >
                            {lang} <span className="text-gray-400">({count})</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* View Profile Button */}
            <a
                href={`https://github.com/${githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition"
                data-aos="fade-up"
                data-aos-delay="200"
            >
                <Github className="w-5 h-5" />
                View Full GitHub Profile
            </a>
        </div>
    );
};

export default GitHubStats;
