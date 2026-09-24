"use client"

import * as React from "react"
import { BubbleMenu } from "@tiptap/react/menus"
import { useCurrentEditor, useEditorState } from "@tiptap/react"
import type { Editor } from "@tiptap/react"
import { AlertTriangle, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

/**
 * Floating menu shown when an inline image is selected: edit its alt text
 * (accessibility + SEO) and optional title. Wedison CMS addition to the
 * Tiptap simple-editor template.
 */
export function ImageAltMenu({ editor: providedEditor }: { editor?: Editor | null }) {
  const { editor: ctxEditor } = useCurrentEditor()
  const editor = providedEditor ?? ctxEditor

  const attrs = useEditorState({
    editor,
    selector: (ctx) => {
      const e = ctx.editor
      if (!e || !e.isActive("image")) return null
      const a = e.getAttributes("image") as { src?: string; alt?: string; title?: string }
      return { src: a.src ?? "", alt: a.alt ?? "", title: a.title ?? "" }
    },
  })

  const [alt, setAlt] = React.useState("")
  const [title, setTitle] = React.useState("")
  const [saved, setSaved] = React.useState(false)

  // Sync local fields whenever a (different) image is selected
  const key = attrs?.src ?? ""
  React.useEffect(() => {
    setAlt(attrs?.alt ?? "")
    setTitle(attrs?.title ?? "")
    setSaved(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  if (!editor) return null

  const save = () => {
    editor.chain().focus().updateAttributes("image", { alt: alt.trim() || null, title: title.trim() || null }).run()
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }
  const dirty = alt !== (attrs?.alt ?? "") || title !== (attrs?.title ?? "")

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="image-alt-menu"
      shouldShow={({ editor: e }) => e.isActive("image")}
      options={{ placement: "bottom", offset: 8 }}
      className="z-50 w-[min(92vw,420px)] rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-md"
    >
      <form
        className="space-y-2"
        onSubmit={(e) => {
          e.preventDefault()
          save()
        }}
      >
        <div className="flex items-center justify-between text-xs font-medium">
          <span>Image details</span>
          {!attrs?.alt && (
            <span className="flex items-center gap-1 text-chart-4">
              <AlertTriangle className="size-3" /> alt text missing
            </span>
          )}
        </div>
        <Input
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="Alt text — describe the image"
          aria-label="Image alt text"
          className="h-8 text-sm"
          autoFocus
        />
        <div className="flex gap-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional, shown on hover)"
            aria-label="Image title"
            className="h-8 text-sm"
          />
          <Button type="submit" size="sm" className="h-8 shrink-0" disabled={!dirty && !saved}>
            {saved ? <Check /> : null} {saved ? "Saved" : "Save"}
          </Button>
        </div>
      </form>
    </BubbleMenu>
  )
}
