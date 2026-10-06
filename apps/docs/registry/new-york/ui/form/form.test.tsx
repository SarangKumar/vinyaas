import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "../button";
import { Checkbox } from "../checkbox";
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxTrigger,
} from "../combobox";
import { DatePicker } from "../date-picker";
import { Input } from "../input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { Switch } from "../switch";
import { Textarea } from "../textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from ".";

describe("Form", () => {
  it("renders the form shell and field anatomy", () => {
    render(
      <Form aria-label="Profile">
        <FormField name="email">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="you@example.com" />
            </FormControl>
            <FormDescription>
              We will use this email for account notifications.
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
        <Button type="submit">Save</Button>
      </Form>,
    );

    expect(screen.getByRole("form", { name: /profile/i })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByText(/account notifications/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("associates label, description, and error with the control", () => {
    render(
      <Form>
        <FormField name="username" error="Username is required">
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input />
            </FormControl>
            <FormDescription>Public profile handle.</FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
      </Form>,
    );

    const input = screen.getByLabelText("Username");
    const description = screen.getByText(/public profile handle/i);
    const message = screen.getByRole("alert");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("data-invalid", "");
    expect(input.getAttribute("aria-describedby")).toContain(description.id);
    expect(input.getAttribute("aria-describedby")).toContain(message.id);
    expect(message).toHaveTextContent("Username is required");
    expect(screen.getByText("Username").className).toMatch(/text-destructive/);
  });

  it("omits FormMessage when there is no error", () => {
    render(
      <Form>
        <FormField name="bio">
          <FormItem>
            <FormLabel>Bio</FormLabel>
            <FormControl>
              <Textarea />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </Form>,
    );

    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByLabelText("Bio")).not.toHaveAttribute("aria-invalid");
  });

  it("propagates disabled state to the control", () => {
    render(
      <Form>
        <FormField name="name" disabled>
          <FormItem>
            <FormLabel>Display name</FormLabel>
            <FormControl>
              <Input />
            </FormControl>
          </FormItem>
        </FormField>
      </Form>,
    );

    expect(screen.getByLabelText("Display name")).toBeDisabled();
  });

  it("generates unique ids across fields", () => {
    render(
      <Form>
        <FormField name="a">
          <FormItem>
            <FormLabel>First</FormLabel>
            <FormControl>
              <Input />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="b">
          <FormItem>
            <FormLabel>Second</FormLabel>
            <FormControl>
              <Input />
            </FormControl>
          </FormItem>
        </FormField>
      </Form>,
    );

    const first = screen.getByLabelText("First");
    const second = screen.getByLabelText("Second");
    expect(first.id).not.toBe(second.id);
  });

  it("works with Select, Combobox, Checkbox, Switch, and DatePicker", () => {
    render(
      <Form>
        <FormField name="role">
          <FormItem>
            <FormLabel>Role</FormLabel>
            <Select defaultValue="editor">
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        </FormField>

        <FormField name="assignee">
          <FormItem>
            <FormLabel>Assignee</FormLabel>
            <Combobox defaultValue="maya">
              <FormControl>
                <ComboboxTrigger placeholder="Select assignee" />
              </FormControl>
              <ComboboxContent>
                <ComboboxItem value="maya">Maya</ComboboxItem>
              </ComboboxContent>
            </Combobox>
          </FormItem>
        </FormField>

        <FormField name="marketing">
          <FormItem className="flex flex-row items-center gap-3">
            <FormControl>
              <Checkbox />
            </FormControl>
            <FormLabel>Marketing emails</FormLabel>
          </FormItem>
        </FormField>

        <FormField name="alerts">
          <FormItem className="flex flex-row items-center gap-3">
            <FormControl>
              <Switch />
            </FormControl>
            <FormLabel>Desktop alerts</FormLabel>
          </FormItem>
        </FormField>

        <FormField name="start">
          <FormItem>
            <FormLabel>Start date</FormLabel>
            <FormControl>
              <DatePicker placeholder="Pick a date" />
            </FormControl>
          </FormItem>
        </FormField>
      </Form>,
    );

    const comboboxes = screen.getAllByRole("combobox");
    expect(comboboxes.length).toBeGreaterThanOrEqual(2);
    for (const control of comboboxes) {
      expect(control).toHaveAttribute("id");
    }
    expect(screen.getByRole("checkbox")).toHaveAttribute("id");
    expect(screen.getByRole("switch")).toHaveAttribute("id");
    expect(
      screen.getByRole("button", { name: /pick a date/i }),
    ).toHaveAttribute("id");
  });

  it("keeps controls in the tab order without trapping focus", () => {
    render(
      <Form>
        <FormField name="name">
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="notes">
          <FormItem>
            <FormLabel>Notes</FormLabel>
            <FormControl>
              <Textarea />
            </FormControl>
          </FormItem>
        </FormField>
        <Button type="submit">Submit</Button>
      </Form>,
    );

    const name = screen.getByLabelText("Name");
    const notes = screen.getByLabelText("Notes");
    const submit = screen.getByRole("button", { name: /submit/i });

    name.focus();
    expect(name).toHaveFocus();
    fireEvent.keyDown(name, { key: "Tab" });
    notes.focus();
    expect(notes).toHaveFocus();
    fireEvent.keyDown(notes, { key: "Tab" });
    submit.focus();
    expect(submit).toHaveFocus();
    fireEvent.keyDown(submit, { key: "Tab", shiftKey: true });
    notes.focus();
    expect(notes).toHaveFocus();
  });

  it("throws when FormLabel is used outside FormField", () => {
    expect(() =>
      render(
        <Form>
          <FormLabel>Orphan</FormLabel>
        </Form>,
      ),
    ).toThrow(/FormField/);
  });
});
