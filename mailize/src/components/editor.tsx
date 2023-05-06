import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { useCallback, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { debounce } from './utils/debounce';

type LexicalEditorProps = {
   config: Parameters<typeof LexicalComposer>['0']['initialConfig'];
};

type LocalStoragePluginProps = {
   namespace: string;
};

export function LocalStoragePlugin({ namespace }: LocalStoragePluginProps) {
   const [editor] = useLexicalComposerContext();

   const saveContent = useCallback(
      (content: string) => {
         localStorage.setItem(namespace, content);
      },
      [namespace]
   );

   const debouncedSaveContent = debounce(saveContent, 500);

   useEffect(() => {
      return editor.registerUpdateListener(
         ({ editorState, dirtyElements, dirtyLeaves }) => {
            if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;

            const serializedState = JSON.stringify(editorState);
            debouncedSaveContent(serializedState)
         }
      );
   }, [debouncedSaveContent, editor]);

   return null;
}

export function LexicalEditor(props: LexicalEditorProps) {
   return (
      <LexicalComposer initialConfig={props.config}>
         <RichTextPlugin
            contentEditable={<ContentEditable className='outline-none focus:border focus:border-[#e7e7e7]' />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
         />
         <HistoryPlugin />
         <LocalStoragePlugin namespace={props.config.namespace} />
      </LexicalComposer>
   );
}

const Placeholder = () => {
   return (
      <div className="absolute top-[1.125rem] left-[1.125rem] opacity-50">
         Start writing...
      </div>
   );
};

const EDITOR_NAMESPACE = "lexical-editor";

export default function Editor() {
   const content = localStorage.getItem(EDITOR_NAMESPACE);

   return (
      <div
         id="editor-wrapper"
         className={
            'relative prose prose-slate prose-p:my-0 prose-headings:mb-4 prose-headings:mt-2 h-full'
         }
      >
         <LexicalEditor
            config={{
               editable: true,
               namespace: EDITOR_NAMESPACE,
               editorState: content,
               theme: {
                  root: 'p-4 rounded h-full min-h-[200px]',
                  link: 'cursor-pointer',
                  text: {
                     bold: 'font-semibold',
                     underline: 'underline',
                     italic: 'italic',
                     strikethrough: 'line-through',
                     underlineStrikethrough: 'underlined-line-through',
                  },
               },
               onError: error => {
                  console.log(error);
               },
            }}
         />
      </div>
   );
}