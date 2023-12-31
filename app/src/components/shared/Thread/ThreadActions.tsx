import { Delete } from "@/components/svgs";
import { cn } from "@/lib/utils";
import { useToast } from "../../ui/toast/use-toast";

export default function ThreadActions({
  authorId,
  threadId,
  path,
  onDelete,
  canDelete,
}: {
  path: string;
  authorId: string;
  threadId: string;
  canDelete: boolean;
  onDelete?: Function;
}) {
  const { toast } = useToast();

  const removeThread = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.({ path, authorId, threadId });
    toast({
      className: cn("top-0 right-0 flex fixed md:max-w-[20rem] md:top-4 md:right-4 py-4"),
      title: "Your thread has been deleted!",
    });
  };

  if (!canDelete) {
    return null;
  }

  return (
    <div className="icon-hover">
      <Delete width={19} height={19} className="text-red-500" onClick={removeThread} />
    </div>
  );
}
