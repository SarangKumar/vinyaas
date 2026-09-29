import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ApiRow } from "@/components/api-table";
import type { ComponentExample } from "@/components/component-reference";
import { ComponentReference } from "@/components/component-reference";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/new-york/ui/avatar";
import type { Metadata } from "next";
import { componentPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = componentPageMetadata("avatar");

const usage = `import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Profile() {
  return (
    <Avatar>
      <AvatarImage src="/avatars/portrait.svg" alt="Sarang Kumar" />
      <AvatarFallback>SK</AvatarFallback>
    </Avatar>
  );
}
`;

const api: ApiRow[] = [
  {
    prop: "src",
    type: "string",
    description: "AvatarImage. Native image source.",
  },
  {
    prop: "alt",
    type: "string",
    description:
      "AvatarImage. Name the person when the image conveys identity. Use an empty string when the image is decorative.",
  },
  {
    prop: "children",
    type: "ReactNode",
    description:
      "Avatar content. AvatarFallback children are initials or other fallback content, shown until the image loads and after it fails.",
  },
  {
    prop: "className",
    type: "string",
    description: "Merged with cn on Avatar, AvatarImage, and AvatarFallback.",
  },
];

const examples: ComponentExample[] = [
  {
    id: "image",
    title: "Image",
    description:
      "The image names the person. The fallback stays out of the accessibility tree while the image is available.",
    preview: (
      <Avatar>
        <AvatarImage src="/avatars/portrait.svg" alt="Sarang Kumar" />
        <AvatarFallback>SK</AvatarFallback>
      </Avatar>
    ),
    code: `<Avatar>
  <AvatarImage src="/avatars/portrait.svg" alt="Sarang Kumar" />
  <AvatarFallback>SK</AvatarFallback>
</Avatar>`,
  },
  {
    id: "initials",
    title: "Fallback initials",
    description:
      "Initials show when the image is missing. After the error, the image is hidden so the initials are the only name.",
    preview: (
      <Avatar>
        <AvatarImage src="/avatars/missing.png" alt="Sarang Kumar" />
        <AvatarFallback>SK</AvatarFallback>
      </Avatar>
    ),
    code: `<Avatar>
  <AvatarImage src="/avatars/missing.png" alt="Sarang Kumar" />
  <AvatarFallback>SK</AvatarFallback>
</Avatar>`,
  },
  {
    id: "fallback-content",
    title: "Fallback content",
    description:
      "Fallback can be any content. With no image, that content is visible and accessible.",
    preview: (
      <Avatar>
        <AvatarFallback>Guest</AvatarFallback>
      </Avatar>
    ),
    code: `<Avatar>
  <AvatarFallback>Guest</AvatarFallback>
</Avatar>`,
  },
  {
    id: "decorative",
    title: "Decorative image",
    description:
      "An empty alt marks the image as decorative. The fallback text is the name only if the image fails.",
    preview: (
      <Avatar>
        <AvatarImage src="/avatars/portrait.svg" alt="" />
        <AvatarFallback>SK</AvatarFallback>
      </Avatar>
    ),
    code: `<Avatar>
  <AvatarImage src="/avatars/portrait.svg" alt="" />
  <AvatarFallback>SK</AvatarFallback>
</Avatar>`,
  },
];

export default async function AvatarPage() {
  const source = await readFile(
    path.join(process.cwd(), "registry/new-york/ui/avatar/index.tsx"),
    "utf8",
  );

  return (
    <ComponentReference
      title="Avatar"
      description="An image with a fallback for a person or entity."
      overview={
        <>
          <p>
            Avatar groups an image and a fallback. AvatarImage is a native{" "}
            <code>img</code>. AvatarFallback is initials or other content.
          </p>
          <p>
            The fallback is visible until the image loads, and it stays visible
            if the image fails. A loaded image replaces the fallback, so the two
            are not both exposed to assistive technology.
          </p>
        </>
      }
      install="vinyaas add avatar"
      manual={
        <p>
          After <code>vinyaas init</code>, place the source at{" "}
          <code>components/ui/avatar/index.tsx</code>. It imports{" "}
          <code>cn</code> from <code>@/lib/utils</code>. The project also needs{" "}
          <code>clsx</code> and <code>tailwind-merge</code>.
        </p>
      }
      usage={usage}
      examples={examples}
      api={api}
      accessibility={
        <>
          <p>
            Give the image a meaningful <code>alt</code> when it identifies a
            person. Use <code>alt=&quot;&quot;</code> when the image is
            decorative.
          </p>
          <ul className="list-disc pl-5">
            <li>
              While the image is loading or has loaded, the fallback is hidden
              from assistive technology so the name is not repeated.
            </li>
            <li>
              If the image fails, the image is removed from the accessibility
              tree and the fallback becomes the name.
            </li>
            <li>
              With no image, the fallback content is the accessible content.
            </li>
          </ul>
        </>
      }
      source={source}
    >
      <Avatar>
        <AvatarImage src="/avatars/portrait.svg" alt="Sarang Kumar" />
        <AvatarFallback>SK</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="/avatars/missing.png" alt="Ada Lovelace" />
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
    </ComponentReference>
  );
}
