import { redirect } from "next/navigation"

export default function Dashboard() {
  // Redirect to the overview page
  redirect("/dashboard/overview")
  
  // This won't be rendered due to the redirect
  return null
}
