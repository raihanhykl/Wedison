"use client"

import { BubbleMenu } from "@tiptap/react/menus"
import type { Editor } from "@tiptap/react"
import { isTextSelection } from "@tiptap/core"

import { useTiptapEditor } from "@/hooks/use-tiptap-editor"
import { Toolbar, ToolbarGroup, ToolbarSeparator } from "@/components/tiptap-ui-primitive/toolbar"
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"
import { MarkButton } from "@/components/tiptap-ui/mark-button"
import { LinkPopover } from "@/components/tiptap-ui/link-popover"
import { ColorHighlightPopover } from "@/components/tiptap-ui/color-highlight-popover"

/**
 * Wedison CMS addition: compact formatting bar that floats above the current text
 * selection, so authors deep in a long article never have to scroll to the main toolbar.
 * Hidden for empty selections, images, code blocks and on small screens (the mobile
 * toolbar is already pinned to the keyboard).
 */
export function SelectionBubbleMenu({ editor: providedEditor }: { editor?: Editor | null }) {
  const { editor } = useTiptapEditor(providedEditor)
  if (!editor) return null

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="selection-bubble-menu"
      updateDelay={120}
      options={{ placement: "top", offset: 8 }}
      shouldShow={({ editor: e, view, state, from, to }) => {
        if (!e.isEditable || !view.hasFocus()) return false
        if (typeof window !== "undefined" && window.matchMedia("(max-width: 480px)").matches) return false
        const { doc, selection } = state
        const empty = from === to || !doc.textBetween(from, to).trim()
        if (empty || !isTextSelection(selection)) return false
        if (e.isActive("image") || e.isActive("codeBlock") || e.isActive("imageUpload")) return false
        return true
      }}
    >
      <Toolbar variant="floating" aria-label="Selection formatting">
        <ToolbarGroup>
          <HeadingDropdownMenu modal={false} levels={[1, 2, 3, 4]} />
          <ListDropdownMenu modal={false} types={["bulletList", "orderedList"]} />
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToolbarGroup>
          <MarkButton type="bold" />
          <MarkButton type="italic" />
          <MarkButton type="underline" />
          <MarkButton type="strike" />
          <MarkButton type="code" />
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToolbarGroup>
          <ColorHighlightPopover />
          <LinkPopover autoOpenOnLinkActive={false} />
        </ToolbarGroup>
      </Toolbar>
    </BubbleMenu>
  )
}
