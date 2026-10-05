"use client";

import { PlayBlock } from "@/app/home/play-block";
import { Button } from "@/registry/new-york/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/registry/new-york/ui/form";
import { Input } from "@/registry/new-york/ui/input";
import { Switch } from "@/registry/new-york/ui/switch";

export function FormBlock() {
  return (
    <PlayBlock
      title="Profile form"
      description="Labels, description, and a preference switch."
    >
      <Form
        className="gap-4"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <FormField name="email">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                type="email"
                defaultValue="ada@vinyaas.dev"
                autoComplete="email"
              />
            </FormControl>
            <FormDescription>Used for account notifications.</FormDescription>
          </FormItem>
        </FormField>
        <FormField name="digest">
          <FormItem className="flex flex-row items-center justify-between gap-3">
            <FormLabel className="font-normal">Weekly digest</FormLabel>
            <FormControl>
              <Switch defaultChecked />
            </FormControl>
          </FormItem>
        </FormField>
        <Button type="submit" size="sm" className="w-full">
          Save
        </Button>
      </Form>
    </PlayBlock>
  );
}
