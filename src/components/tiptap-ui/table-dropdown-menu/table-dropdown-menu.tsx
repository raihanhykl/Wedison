"use client"

import { forwardRef, useState } from "react"
import { useEditorState } from "@tiptap/react"
import type { Editor } from "@tiptap/react"
import { Table as TableIcon } from "lucide-react"

import { ChevronDownIcon } from "@/components/tiptap-icons/chevron-down-icon"
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button"
import { Button } from "@/components/tiptap-ui-primitive/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/tiptap-ui-primitive/dropdown-menu"

export interface TableDropdownMenuProps extends Omit<ButtonProps, "type"> {
  editor?: Editor | null
  modal?: boolean
}

/**
 * Wedison CMS addition: insert and edit tables (imported Word tables need this to survive).
 */
export const TableDropdownMenu = forwardRef<HTMLButtonElement, TableDropdownMenuProps>(
  ({ editor: providedEditor, modal = false, ...buttonProps }, ref) => {
    const { editor } = useTiptapEditor(providedEditor)
    const [open, setOpen] = useState(false)
    const state = useEditorState({
      editor,
      selector: (ctx) => ({
        inTable: ctx.editor?.isActive("table") ?? false,
        canInsert: ctx.editor?.can().insertTable({ rows: 3, cols: 3, withHeaderRow: true }) ?? false,
      }),
    })
    if (!editor) return null
    const run = (fn: (chain: ReturnType<Editor["chain"]>) => ReturnType<Editor["chain"]>) => () => {
      fn(editor.chain().focus()).run()
      setOpen(false)
    }
    const inTable = state?.inTable ?? false

    return (
      <DropdownMenu modal={modal} open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            data-active-state={inTable ? "on" : "off"}
            role="button"
            tabIndex={-1}
            disabled={!inTable && !state?.canInsert}
            aria-label="Table"
            tooltip="Table"
            {...buttonProps}
            ref={ref}
          >
            <TableIcon className="tiptap-button-icon" />
            <ChevronDownIcon className="tiptap-button-dropdown-small" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Button type="button" variant="ghost" data-style="ghost" onClick={run((c) => c.insertTable({ rows: 3, cols: 3, withHeaderRow: true }))}>
                <TableIcon className="tiptap-button-icon" />
                <span className="tiptap-button-text">Insert table (3×3)</span>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          {inTable && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {(
                  [
                    ["Add row above", (c: ReturnType<Editor["chain"]>) => c.addRowBefore()],
                    ["Add row below", (c: ReturnType<Editor["chain"]>) => c.addRowAfter()],
                    ["Delete row", (c: ReturnType<Editor["chain"]>) => c.deleteRow()],
                    ["Add column left", (c: ReturnType<Editor["chain"]>) => c.addColumnBefore()],
                    ["Add column right", (c: ReturnType<Editor["chain"]>) => c.addColumnAfter()],
                    ["Delete column", (c: ReturnType<Editor["chain"]>) => c.deleteColumn()],
                    ["Toggle header row", (c: ReturnType<Editor["chain"]>) => c.toggleHeaderRow()],
                    ["Merge / split cells", (c: ReturnType<Editor["chain"]>) => c.mergeOrSplit()],
                  ] as const
                ).map(([label, fn]) => (
                  <DropdownMenuItem key={label} asChild>
                    <Button type="button" variant="ghost" data-style="ghost" onClick={run(fn)}>
                      <span className="tiptap-button-text">{label}</span>
                    </Button>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Button type="button" variant="ghost" data-style="ghost" onClick={run((c) => c.deleteTable())}>
                    <span className="tiptap-button-text">Delete table</span>
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)
TableDropdownMenu.displayName = "TableDropdownMenu"
