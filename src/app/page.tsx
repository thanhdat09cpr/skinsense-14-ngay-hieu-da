import { redirect } from "next/navigation";
import { PAGE_PATH } from "@/lib/campaign-config";

/** The prototype only hosts the campaign page. */
export default function Home() {
  redirect(PAGE_PATH);
}
