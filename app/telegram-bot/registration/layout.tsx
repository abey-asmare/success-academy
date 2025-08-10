import Nav from "./components/Nav";

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <div className="h-full">
        <Nav/>
        <main className="h-full">
          {children}
        </main>
    </div>
  )
}
