"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bold, Italic, List, Link, Eye, Edit } from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState("write")

  const insertMarkdown = (before: string, after = "") => {
    const textarea = document.getElementById("content-textarea") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)

    onChange(newText)

    // Reset cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  const renderPreview = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br>")
  }

  return (
    <div className="border rounded-lg">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between border-b px-3 py-2">
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("**", "**")} title="Bold">
              <Bold className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("*", "*")} title="Italic">
              <Italic className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("- ")} title="List">
              <List className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown("[", "](url)")} title="Link">
              <Link className="h-4 w-4" />
            </Button>
          </div>

          <TabsList className="grid w-32 grid-cols-2">
            <TabsTrigger value="write" className="text-xs">
              <Edit className="h-3 w-3 mr-1" />
              Write
            </TabsTrigger>
            <TabsTrigger value="preview" className="text-xs">
              <Eye className="h-3 w-3 mr-1" />
              Preview
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="write" className="m-0">
          <Textarea
            id="content-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write your content here... You can use **bold**, *italic*, and other markdown formatting."
            className="min-h-[200px] border-0 focus-visible:ring-0 resize-none"
          />
        </TabsContent>

        <TabsContent value="preview" className="m-0">
          <div
            className="min-h-[200px] p-3 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{
              __html: renderPreview(value) || "<p class='text-gray-500'>Nothing to preview</p>",
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
