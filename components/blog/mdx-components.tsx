import { isPoemCategory, getCategoryAccent, getCategorySlug } from "@/lib/blog/categories";
import { PoemLine } from "@/components/blog/PoemLine";
import { ProseParagraph } from "@/components/blog/ProseParagraph";
import { PullQuote } from "@/components/blog/PullQuote";
import { CaptionedImage } from "@/components/blog/CaptionedImage";
import { SectionHeading } from "@/components/blog/SectionHeading";
import { CodeBlock } from "@/components/blog/CodeBlock";
import {
  InfoBox,
  WarningBox,
  SuccessBox,
  TipBox,
  Notes as NotesBox,
  Callout,
} from "@/components/mdx/admonitions";
import {
  Definition,
  Example,
  ExamTip,
  KeyPoints,
  Quote,
} from "@/components/mdx/academic";
import {
  ComparisonTable,
} from "@/components/mdx/layout";
import { ResponsiveTable } from "@/components/blog/ResponsiveTable";
import {
  YouTube,
  PdfEmbed,
  DownloadButton,
  CloudinaryImage,
} from "@/components/mdx/media";
import {
  Accordion,
  FAQ,
  Mermaid,
} from "@/components/mdx/interactive";
import {
  CopyButton as CodeCopyButton,
} from "@/components/mdx/code";

/**
 * Returns the MDX component map for a given post category.
 *
 * The component map is what makes MDX rich: every <InfoBox>, <YouTube>,
 * <ComparisonTable> etc. in the post body is matched here.
 */
export function mdxComponents(category: string) {
  const isPoem = isPoemCategory(category);
  const accent = getCategoryAccent(getCategorySlug(category));

  return {
    // --- Element-level overrides ----------------------------------------
    p: (props: { children?: React.ReactNode }) =>
      isPoem ? <PoemLine {...props} /> : <ProseParagraph {...props} />,
    blockquote: (props: { children?: React.ReactNode }) => (
      <PullQuote {...props} color={accent} />
    ),
    img: (props: { src?: string; alt?: string; title?: string }) => (
      <CaptionedImage {...props} />
    ),
    h2: (props: { children?: React.ReactNode }) => (
      <SectionHeading level={2} {...props} />
    ),
    h3: (props: { children?: React.ReactNode }) => (
      <SectionHeading level={3} {...props} />
    ),
    pre: (props: { children?: React.ReactNode; className?: string }) => (
      <CodeBlock {...props} />
    ),

    // --- Admonitions ----------------------------------------------------
    InfoBox,
    WarningBox,
    SuccessBox,
    TipBox,
    Notes: NotesBox,
    Callout,

    // --- Academic -------------------------------------------------------
    Definition,
    Example,
    ExamTip,
    KeyPoints,
    Quote,

    // --- Layout ---------------------------------------------------------
    ComparisonTable,
    ResponsiveTable,

    // --- Media ----------------------------------------------------------
    YouTube,
    PdfEmbed,
    DownloadButton,
    CloudinaryImage,

    // --- Interactive ----------------------------------------------------
    Accordion,
    FAQ,
    Mermaid,

    // --- Code utilities -------------------------------------------------
    CopyButton: CodeCopyButton,
  };
}
