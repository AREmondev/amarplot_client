import { ReactNode } from 'react';

interface AddPropertyLayoutProps {
  sidebar: ReactNode;
  content: ReactNode;
}

export const AddPropertyLayout = ({ sidebar, content }: AddPropertyLayoutProps) => (
  <div className="flex flex-col md:flex-row gap-8 p-4 max-w-7xl mx-auto">
    <aside className="w-full md:w-1/3 lg:w-1/4">{sidebar}</aside>
    <main className="flex-1">{content}</main>
  </div>
);
