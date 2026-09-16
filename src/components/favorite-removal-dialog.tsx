import { Dialog } from "@base-ui/react/dialog";
 
interface FavoriteRemovalDialogProps {
  characterName: string;
  membershipsCount: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRemove: () => void;
}
 
export function FavoriteRemovalDialog({
  characterName,
  membershipsCount,
  open,
  onOpenChange,
  onRemove,
}: FavoriteRemovalDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-canvas-dark/72 opacity-100 transition-opacity duration-150 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-[51] w-[26rem] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 scale-100 border border-border-strong bg-surface p-6 opacity-100 shadow-lg transition-[opacity,transform] duration-200 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0">
          <span className="mb-3 flex items-center gap-1.5 text-[0.625rem] tracking-[0.08em] text-signal uppercase">Favorite removal</span>
          <Dialog.Title className="mb-3 text-3xl">Remove “{characterName}”?</Dialog.Title>
          <Dialog.Description className="text-content-muted">
            This will also remove the character from {membershipsCount}{" "}
            {membershipsCount === 1 ? "list" : "lists"}.
          </Dialog.Description>
          <div className="flex justify-end gap-2">
            <Dialog.Close className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border-strong bg-transparent px-4 py-2.5 text-[0.8125rem] font-semibold text-content-secondary">
              Keep favorite
            </Dialog.Close>
            <button
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-alert bg-alert px-4 py-2.5 text-[0.8125rem] font-semibold text-white"
              type="button"
              onClick={onRemove}
            >
              Remove everywhere
            </button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
