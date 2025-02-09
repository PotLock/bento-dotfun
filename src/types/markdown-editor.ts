import { Markdown as PrismaMarkdown } from '@prisma/client';

export interface Markdown extends PrismaMarkdown {
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