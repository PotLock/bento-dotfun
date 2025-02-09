export interface MarkdownEditorOptions {
  container: HTMLElement | null;
  initialValue?: string;
  supportEmoji?: boolean;
}

export interface MarkdownEditor {
  new (options: MarkdownEditorOptions): MarkdownEditor;
} 