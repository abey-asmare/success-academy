import Nav from "@/app/(main)/components/Nav"

export default function SimulationLayout({children}: {children: React.ReactNode}) {
  return (
    <div>
      <Nav />
      
      <main className="mt-12">{children}</main>
    </div>
  )
}
