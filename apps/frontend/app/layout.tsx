import "./globals.css";

export const metadata = {
  title: "Taskflow",
  description: "Premium task management for productive teams",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
