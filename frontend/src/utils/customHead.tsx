import Head from "next/head";

type CustomHeadProps = {
  title: string;
  content?: string;
  pageSlug?: string;
  pageType?: string;
  ogImage?: string;
};

export default function CustomHead({
  title,
  content,
  pageSlug,
  pageType = "website",
  ogImage = `${process.env.NEXT_PUBLIC_BASE_URL}/layout/og-image.png`,
}: CustomHeadProps) {
  // const ogTitle = title.replace(" - Some Name", "");
  // const pageURL = `${process.env.NEXT_PUBLIC_BASE_URL}${pageSlug}`;

  return (
    <Head>
      <title>{title} | Recruvia</title>
      <link rel="icon" href="/assets/images/logo/LogoSQ.png" />
      {/* <meta name="description" content={content} />
      <link rel="canonical" href={pageURL} />
      <meta property="og:type" content={pageType} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={content} />
      <meta property="og:url" content={pageURL} />
      <meta property="og:image" content={ogImage} /> */}
    </Head>
  );
}
