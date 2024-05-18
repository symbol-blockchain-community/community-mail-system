import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import sanitizeHtml from "sanitize-html";

type Props = {
  content: string;
  onClosed: (open: boolean) => void;
};

export function PreviewDialog(props: Props): JSX.Element {
  return (
    <AlertDialog open={!!props.content} onOpenChange={props.onClosed}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Preview</AlertDialogTitle>
          <AlertDialogDescription>
            <div
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(props.content, { allowedAttributes: { "*": ["style", "class", "href"] } }),
              }}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant={"outline"} onClick={() => props.onClosed(false)}>
            Close
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
