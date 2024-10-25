import type { MetaFunction } from "@remix-run/node";
import { Button } from "~/components/ui/button"

export const meta: MetaFunction = () => {
  return [
    { title: "wavebreaker remix test" },
    { name: "description", content: "Why" },
  ];
};

export default function Index() {
  return (
    <div>
      <h1>oh no.</h1>
      <p>
        oh no oh no.
      </p>
      <Button>this is a button</Button>
    </div>
    
  );
}