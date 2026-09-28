"use client";

import { Avatar, AvatarFallback } from "@/registry/new-york/ui/avatar/avatar";
import { Badge } from "@/registry/new-york/ui/badge/badge";
import { Button } from "@/registry/new-york/ui/button/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/new-york/ui/dropdown-menu/dropdown-menu";
import { Progress } from "@/registry/new-york/ui/progress/progress";

function MoreIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}

export function ProfileCardDemo() {
  return (
    <Card className="w-full max-w-sm text-left">
      <CardHeader>
        <div className="flex min-w-0 items-start gap-3">
          <Avatar>
            <AvatarFallback>SK</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <CardTitle>Sarang Kumar</CardTitle>
            <CardDescription>
              Developer. Building accessible UI that you install as source.
            </CardDescription>
          </div>
        </div>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon-sm" aria-label="More actions">
                <MoreIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View profile</DropdownMenuItem>
              <DropdownMenuItem>Copy link</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <Badge>Verified</Badge>
      <CardFooter className="gap-2">
        <Button variant="outline">Message</Button>
        <Button>Follow</Button>
      </CardFooter>
    </Card>
  );
}

export function ProjectCardDemo() {
  return (
    <Card className="w-full max-w-sm text-left">
      <CardHeader>
        <div>
          <CardTitle>Production Dashboard</CardTitle>
          <CardDescription>
            Updated 2 hours ago by Sarang Kumar.
          </CardDescription>
        </div>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Project actions"
              >
                <MoreIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Open project</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">Archive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-2">
        <Badge variant="secondary">On track</Badge>
        <Progress aria-label="Project progress" value={72} />
      </CardContent>
      <CardFooter>
        <Button variant="outline">View project</Button>
      </CardFooter>
    </Card>
  );
}
