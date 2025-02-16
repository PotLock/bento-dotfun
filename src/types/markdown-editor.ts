export interface Markdown {
  id: string;
  title: string;
  content: string;
  htmlContent: string;
  userAddress: string;
  createdAt: Date;
  isShared: boolean;
  user?: {
    address: string;
    image: string;
  };
}

export interface MarkdownWithUser extends Markdown {
  user: {
    address: string;
    image: string;
  };
}

export interface MarkdownEditorOptions {
  container: HTMLElement | null;
  initialValue?: string;
  supportEmoji?: boolean;
}

export interface MarkdownEditor {
  new (options: MarkdownEditorOptions): MarkdownEditor;
} 