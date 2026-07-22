import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface PageContent {
  title: string;
  content: string;
}

const DynamicPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(false);

  const isReservedSlug = ['privacy-policy', 'terms-and-conditions', 'contact-us'].includes(slug || '');

  useEffect(() => {
    if (isReservedSlug || !slug) return;
    setLoading(false);
  }, [slug, isReservedSlug]);

  if (isReservedSlug) {
    return null;
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#0f0400] pt-28 pb-10 sm:pt-32 sm:pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-white text-3xl sm:text-4xl font-bold tracking-tight">
            {content ? content.title : "Page"}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="max-w-none text-gray-700 
            [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-[#0f0400] [&_h1]:mb-3
            [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#0f0400] [&_h2]:mb-2 [&_h2]:mt-6 
            [&_p]:mb-2 [&_p]:text-gray-700 [&_p]:leading-normal [&_p]:text-base
            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_ul]:text-base
            [&_li]:mb-0
            [&_a]:text-[#ff4a1f] hover:[&_a]:underline"
        >
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : content ? (
            <div dangerouslySetInnerHTML={{ __html: content.content }} />
          ) : (
            <div className="text-center py-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
              <p className="text-gray-500">The page you are looking for does not exist or has been unpublished.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicPage;
