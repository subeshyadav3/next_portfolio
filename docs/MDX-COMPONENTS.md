# MDX Components Reference

All components are available inside post content — no imports needed.

---

## Embedding PDFs with local viewer

Replaces the old broken iframe — renders PDF on your own site via `/pdf-viewer`.

```mdx
<PdfEmbed
  src="https://res.cloudinary.com/.../file.pdf"
  title="Optional title"
  height={900}
/>
```

| Prop   | Required | Default |
|--------|----------|---------|
| src    | yes      | —       |
| title  | no       | "PDF document" |
| height | no       | 800     |

---

## Download Button (card style)

Prominent download card with icon, title, optional filename, and a Download button.

```mdx
<DownloadButton
  href="https://res.cloudinary.com/.../file.pdf"
  filename="SEE_2080_Question_Papers.pdf"
>
  SEE 2080 All Subjects Question Papers
</DownloadButton>
```

| Prop     | Required | Description         |
|----------|----------|---------------------|
| href     | yes      | File URL            |
| filename | no       | Shows below title   |
| children | yes      | Title text          |

---

## YouTube Embed

```mdx
<YouTube id="dQw4w9WgXcQ" title="Video title" start={30} />
```

| Prop  | Required | Default |
|-------|----------|---------|
| id    | yes      | —       |
| title | no       | "YouTube video" |
| start | no       | 0       |

---

## Cloudinary Image

```mdx
<CloudinaryImage
  publicId="folder/image_id"
  alt="Description"
  width={800}
  height={600}
  transforms="f_auto,q_auto,w_800"
  caption="Optional caption"
/>
```

| Prop       | Required | Default           |
|------------|----------|-------------------|
| publicId   | yes      | —                 |
| alt        | yes      | —                 |
| width      | no       | —                 |
| height     | no       | —                 |
| transforms | no       | "f_auto,q_auto"   |
| caption    | no       | —                 |
| className  | no       | —                 |

---

## Admonitions (info boxes)

```mdx
<InfoBox title="Custom title">
  Markdown or HTML content here.
</InfoBox>
```

Available: `InfoBox`, `WarningBox`, `SuccessBox`, `TipBox`, `Notes`, `Callout`

| Prop  | Required | Default       |
|-------|----------|---------------|
| title | no       | "Info" etc.   |
| children | yes  | —             |

---

## Academic

```mdx
<Definition term="Photosynthesis">
  Process by which plants convert light into energy.
</Definition>

<Example title="Optional title">
  Worked example here.
</Example>

<ExamTip>
  Key exam advice text.
</ExamTip>

<KeyPoints title="Summary">
  - Point one
  - Point two
</KeyPoints>

<Quote author="Albert Einstein">
  Imagination is more important than knowledge.
</Quote>
```

---

## Interactive

### Accordion
```mdx
<Accordion title="Click to expand">
  Hidden content goes here — supports **markdown**.
</Accordion>
```

### FAQ (with JSON-LD schema)
```mdx
<FAQ items={[
  { question: "What is SEE?", answer: "Secondary Education Examination." },
  { question: "How to prepare?", answer: "Practice past papers." },
]} />
```

### Mermaid Diagrams
```mdx
<Mermaid chart="
graph TD
  A[Start] --> B{Decision}
  B -->|Yes| C[Action]
  B -->|No| D[End]
" />
```

---

## Layout

```mdx
<ComparisonTable
  headers={["Feature", "Free", "Pro"]}
  rows={[
    ["Users", "1", "Unlimited"],
    ["Storage", "1GB", "100GB"],
  ]}
  caption="Plan comparison"
/>

<Figure src="/image.png" alt="Alt text" caption="Optional caption" />
```

---

## Code

```mdx
<CopyButton text="Text to copy" />

<CodeBlock title="server.ts">
```ts
console.log("hello");
``\`
</CodeBlock>
```

---

## Auto-generated elements (no usage needed)

| Element | Behavior |
|---------|----------|
| `p`     | Renders as prose paragraph (or poem line in poem category) |
| `blockquote` | Styled pull quote with accent color |
| `img`   | Captioned image with error fallback |
| `h2` / `h3` | Auto-linked heading with # anchor |
| `pre`   | Code block with copy button, language badge |
| `table` | Horizontally scrollable responsive table |
