"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Users,
  Eye,
  Clock,
  MousePointerClick,
  TrendingUp,
  Globe,
  Monitor,
  BarChart3,
} from "lucide-react";

interface AnalyticsData {
  overview: {
    sessions: string;
    users: string;
    pageViews: string;
    avgSessionDuration: string;
    bounceRate: string;
    engagedSessions: string;
  };
  topPages: Array<Record<string, string>>;
  trafficSources: Array<Record<string, string>>;
  devices: Array<Record<string, string>>;
  countries: Array<Record<string, string>>;
  dailyTrend: Array<Record<string, string>>;
}

function formatDuration(seconds: string) {
  const s = Math.round(parseFloat(seconds));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return m > 0 ? `${m}m ${rem}s` : `${rem}s`;
}

function formatNumber(val: string) {
  return parseInt(val, 10).toLocaleString();
}

function formatPercent(val: string) {
  return `${(parseFloat(val) * 100).toFixed(1)}%`;
}

function formatDate(dateStr: string) {
  // GA4 returns dates as YYYYMMDD
  const y = dateStr.slice(0, 4);
  const m = dateStr.slice(4, 6);
  const d = dateStr.slice(6, 8);
  return `${m}/${d}/${y}`;
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {title}
        </CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}

function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            {headers.map((h) => (
              <th key={h} className="pb-2 pr-4 font-medium text-muted-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="py-2.5 pr-4">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MiniBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground w-12 text-right">
        {value.toLocaleString()}
      </span>
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/analytics?days=${days}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.error) {
          setError(json.error);
        } else {
          setData(json);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [days]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-lg bg-primary p-2.5 hover:opacity-90 transition-opacity"
            >
              <BarChart3 className="h-6 w-6 text-primary-foreground" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight">
                Analytics Dashboard
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                Google Analytics insights for elementthree.com
              </p>
            </div>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Portal
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Date range selector */}
        <div className="flex gap-2 mb-6">
          {[7, 14, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                days === d
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {d}d
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="text-muted-foreground text-sm">
              Loading analytics data...
            </div>
          </div>
        )}

        {error && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-destructive font-medium mb-1">
                Failed to load analytics
              </p>
              <p className="text-sm text-muted-foreground">{error}</p>
              <p className="text-xs text-muted-foreground mt-3">
                Make sure the service account has Viewer access to the GA4
                property.
              </p>
            </CardContent>
          </Card>
        )}

        {data && !loading && (
          <div className="space-y-6">
            {/* Overview stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Users"
                value={formatNumber(data.overview.users)}
                icon={Users}
              />
              <StatCard
                title="Page Views"
                value={formatNumber(data.overview.pageViews)}
                icon={Eye}
              />
              <StatCard
                title="Sessions"
                value={formatNumber(data.overview.sessions)}
                icon={MousePointerClick}
              />
              <StatCard
                title="Avg. Session Duration"
                value={formatDuration(data.overview.avgSessionDuration)}
                icon={Clock}
              />
            </div>

            {/* Secondary stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                title="Bounce Rate"
                value={formatPercent(data.overview.bounceRate)}
                icon={TrendingUp}
              />
              <StatCard
                title="Engaged Sessions"
                value={formatNumber(data.overview.engagedSessions)}
                icon={MousePointerClick}
              />
              <StatCard
                title="Engagement Rate"
                value={formatPercent(
                  String(
                    parseInt(data.overview.engagedSessions) /
                      Math.max(parseInt(data.overview.sessions), 1)
                  )
                )}
                icon={TrendingUp}
              />
            </div>

            {/* Daily trend */}
            {data.dailyTrend.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Daily Trend</CardTitle>
                  <CardDescription>
                    Sessions, users, and page views over the last {days} days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto max-h-64 overflow-y-auto">
                    <DataTable
                      headers={["Date", "Sessions", "Users", "Page Views"]}
                      rows={data.dailyTrend.map((d) => [
                        formatDate(d.date),
                        formatNumber(d.sessions),
                        formatNumber(d.users),
                        formatNumber(d.pageViews),
                      ])}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tabbed detail tables */}
            <Tabs defaultValue="pages">
              <TabsList>
                <TabsTrigger value="pages">Top Pages</TabsTrigger>
                <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
                <TabsTrigger value="countries">Countries</TabsTrigger>
                <TabsTrigger value="devices">Devices</TabsTrigger>
              </TabsList>

              <TabsContent value="pages">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-4 w-4" /> Top Pages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.topPages.length > 0 ? (
                      <DataTable
                        headers={[
                          "Page",
                          "Views",
                          "Users",
                          "Avg. Duration",
                        ]}
                        rows={data.topPages.map((p) => [
                          p.pagePath,
                          formatNumber(p.pageViews),
                          formatNumber(p.users),
                          formatDuration(p.avgSessionDuration),
                        ])}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No page data available
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sources">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" /> Traffic Sources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.trafficSources.length > 0 ? (
                      (() => {
                        const maxSessions = Math.max(
                          ...data.trafficSources.map((s) =>
                            parseInt(s.sessions)
                          )
                        );
                        return (
                          <div className="space-y-3">
                            {data.trafficSources.map((s) => (
                              <div key={s.channel}>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="font-medium">
                                    {s.channel}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {formatNumber(s.users)} users
                                  </span>
                                </div>
                                <MiniBar
                                  value={parseInt(s.sessions)}
                                  max={maxSessions}
                                />
                              </div>
                            ))}
                          </div>
                        );
                      })()
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No traffic source data available
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="countries">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-4 w-4" /> Top Countries
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.countries.length > 0 ? (
                      (() => {
                        const maxSessions = Math.max(
                          ...data.countries.map((c) => parseInt(c.sessions))
                        );
                        return (
                          <div className="space-y-3">
                            {data.countries.map((c) => (
                              <div key={c.country}>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="font-medium">
                                    {c.country}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {formatNumber(c.users)} users
                                  </span>
                                </div>
                                <MiniBar
                                  value={parseInt(c.sessions)}
                                  max={maxSessions}
                                />
                              </div>
                            ))}
                          </div>
                        );
                      })()
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No country data available
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="devices">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" /> Devices
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.devices.length > 0 ? (
                      (() => {
                        const maxSessions = Math.max(
                          ...data.devices.map((d) => parseInt(d.sessions))
                        );
                        return (
                          <div className="space-y-3">
                            {data.devices.map((d) => (
                              <div key={d.device}>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="font-medium capitalize">
                                    {d.device}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {formatNumber(d.users)} users
                                  </span>
                                </div>
                                <MiniBar
                                  value={parseInt(d.sessions)}
                                  max={maxSessions}
                                />
                              </div>
                            ))}
                          </div>
                        );
                      })()
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No device data available
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </div>
  );
}
