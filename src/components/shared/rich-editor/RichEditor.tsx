import { useEffect, useState } from "react";
import type { ButtonHTMLAttributes } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  AlignCenter,
  AlignLeft,
  Italic,
  List,
  ListOrdered,
  Sparkles,
  SpellCheck,
  Strikethrough,
  Underline as UnderlineIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AIPolishDialog } from "@/components/shared/ai/AIPolishDialog";
import { GrammarCheckDialog } from "@/components/editor/grammar/GrammarCheckDialog";

export interface RichEditorProps {
  html: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
  /** 传给 AI 弹窗的字段名，便于识别正在处理哪段内容 */
  fieldLabel?: string;
  aiActions?: boolean;
}

const ToolbarButton = ({
  active,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) => (
  <button
    type="button"
    className={cn(
      "inline-flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
      active && "bg-accent text-foreground",
      className,
    )}
    {...props}
  />
);

export const RichEditor = ({
  html,
  onChange,
  placeholder,
  minHeight = 96,
  fieldLabel,
  aiActions = true,
}: RichEditorProps) => {
  const [polishOpen, setPolishOpen] = useState(false);
  const [grammarOpen, setGrammarOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false, codeBlock: false }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      TextAlign.configure({ types: ["paragraph", "listItem"] }),
      Placeholder.configure({ placeholder: placeholder ?? "" }),
    ],
    content: html,
    editorProps: { attributes: { class: "tiptap" } },
    onUpdate: ({ editor: instance }) => {
      const next = instance.getHTML();
      onChange(next === "<p></p>" ? "" : next);
    },
  });

  // 外部（撤销 / AI 应用）改动时同步进编辑器，输入过程中不重建实例
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (html !== current && html !== (current === "<p></p>" ? "" : current)) {
      editor.commands.setContent(html || "", false);
    }
  }, [html, editor]);

  if (!editor) {
    return (
      <div
        className="rounded-md border border-dashed bg-muted/30"
        style={{ minHeight }}
        aria-hidden
      />
    );
  }

  return (
    <div className="rich-editor space-y-1.5">
      <div className="no-print flex flex-wrap items-center gap-0.5 rounded-md border bg-muted/30 px-1 py-0.5">
        <ToolbarButton active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough className="h-3.5 w-3.5" />
        </ToolbarButton>
        <span className="mx-1 h-4 w-px bg-border" />
        <ToolbarButton active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <AlignCenter className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <AlignLeft className="h-3.5 w-3.5" />
        </ToolbarButton>
        <span className="mx-1 h-4 w-px bg-border" />
        <div className="ml-auto flex items-center gap-1">
          {aiActions && (
            <>
              <Button size="sm" variant="ghost" className="h-7 gap-1 px-2 text-xs" onClick={() => setPolishOpen(true)}>
                <Sparkles className="h-3.5 w-3.5" />
                AI 润色
              </Button>
              <Button size="sm" variant="ghost" className="h-7 gap-1 px-2 text-xs" onClick={() => setGrammarOpen(true)}>
                <SpellCheck className="h-3.5 w-3.5" />
                语法检查
              </Button>
            </>
          )}
        </div>
      </div>

      <div style={{ minHeight }} className="overflow-hidden">
        <EditorContent editor={editor} />
      </div>

      <AIPolishDialog
        open={polishOpen}
        onOpenChange={setPolishOpen}
        html={html}
        fieldLabel={fieldLabel}
        onApply={onChange}
      />
      <GrammarCheckDialog
        open={grammarOpen}
        onOpenChange={setGrammarOpen}
        html={html}
        fieldLabel={fieldLabel}
        onChange={onChange}
      />
    </div>
  );
};
