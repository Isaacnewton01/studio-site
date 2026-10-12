import { getContent } from "@/lib/content";
import Site from "@/components/Site";

export default async function Page() { return <Site c={await getContent()} />; }
