/**
 * MDX component barrel — the single import surface for the MDX pipeline.
 */
export {
  InfoBox,
  WarningBox,
  SuccessBox,
  TipBox,
  Notes,
  Callout,
} from "./admonitions";

export {
  Definition,
  Example,
  ExamTip,
  KeyPoints,
  Quote,
  PullQuote,
} from "./academic";

export {
  ComparisonTable,
  ResponsiveTable,
  Figure,
} from "./layout";

export { Accordion, FAQ, Mermaid } from "./interactive";

export {
  YouTube,
  PdfEmbed,
  DownloadButton,
  CloudinaryImage,
} from "./media";

export { CodeBlock, CopyButton } from "./code";
