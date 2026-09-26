import { Button } from "@/registry/ui/button";

export default function Home() {
  return (
    <div>
      <Button className="w-full">Save</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="outline" disabled>
        Cancel
      </Button>
      <Button size="lg">Save</Button>
    </div>
  );
}
