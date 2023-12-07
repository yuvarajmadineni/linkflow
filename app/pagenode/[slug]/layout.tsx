export default function Layout({ children }: React.PropsWithChildren) {
  return <main className="flex flex-grow w-full min-h-screen">{children}</main>;
}
