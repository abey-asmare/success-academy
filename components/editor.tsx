'use client';

import 'easymde/dist/easymde.min.css';
import dynamic from 'next/dynamic';

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
});

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const Editor = ({ value, onChange }: EditorProps) => {
  return (
    <div className="bg-white">
      <SimpleMDE value={value} onChange={onChange} />
    </div>
  );
};
