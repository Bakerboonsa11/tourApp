'use client';

export default function TestPage({ params }: { params: { slag: string } }) {
  return <div>Test page with slag: {params.slag}</div>;
}
