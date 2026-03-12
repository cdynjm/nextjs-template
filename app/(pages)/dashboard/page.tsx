"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Navbar } from "@/components/navbar";
import SessionGuard from "@/components/auth/session-guard";
import { SkeletonDelay } from "@/components/ui/skeleton-delay";
import { SkeletonCard } from "@/components/skeleton-card";

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <SessionGuard>
      <SidebarProvider>
        <AppSidebar />

        <div className="flex flex-col w-full min-h-screen">
          <Navbar title="Dashboard" />

          <main className="p-6 flex-1">
            <SkeletonDelay skeleton={<SkeletonCard />}>
              <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                  <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
                    <Card className="@container/card">
                      <CardHeader>
                        <CardDescription>Total Revenue</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                          $1,250.00
                        </CardTitle>
                        <CardAction>
                          <Badge variant="outline">
                            <IconTrendingUp />
                            +12.5%
                          </Badge>
                        </CardAction>
                      </CardHeader>
                      <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                          Trending up this month{" "}
                          <IconTrendingUp className="size-4" />
                        </div>
                        <div className="text-muted-foreground">
                          Visitors for the last 6 months
                        </div>
                      </CardFooter>
                    </Card>
                    <Card className="@container/card">
                      <CardHeader>
                        <CardDescription>New Customers</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                          1,234
                        </CardTitle>
                        <CardAction>
                          <Badge variant="outline">
                            <IconTrendingDown />
                            -20%
                          </Badge>
                        </CardAction>
                      </CardHeader>
                      <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                          Down 20% this period{" "}
                          <IconTrendingDown className="size-4" />
                        </div>
                        <div className="text-muted-foreground">
                          Acquisition needs attention
                        </div>
                      </CardFooter>
                    </Card>
                    <Card className="@container/card">
                      <CardHeader>
                        <CardDescription>Active Accounts</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                          45,678
                        </CardTitle>
                        <CardAction>
                          <Badge variant="outline">
                            <IconTrendingUp />
                            +12.5%
                          </Badge>
                        </CardAction>
                      </CardHeader>
                      <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                          Strong user retention{" "}
                          <IconTrendingUp className="size-4" />
                        </div>
                        <div className="text-muted-foreground">
                          Engagement exceed targets
                        </div>
                      </CardFooter>
                    </Card>
                    <Card className="@container/card">
                      <CardHeader>
                        <CardDescription>Growth Rate</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                          4.5%
                        </CardTitle>
                        <CardAction>
                          <Badge variant="outline">
                            <IconTrendingUp />
                            +4.5%
                          </Badge>
                        </CardAction>
                      </CardHeader>
                      <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                          Steady performance increase{" "}
                          <IconTrendingUp className="size-4" />
                        </div>
                        <div className="text-muted-foreground">
                          Meets growth projections
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </div>
            </SkeletonDelay>
          </main>
        </div>
      </SidebarProvider>
    </SessionGuard>
  );
}
