import clsx from "clsx";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { api } from "~/utils/api";

export const COLOR_LIST = [
  { color: "blue", gradients: clsx("from-blue-600 to-sky-600") },
  { color: "green", gradients: clsx("from-green-600 to-lime-600") },
  { color: "orange", gradients: clsx("from-orange-600 to-amber-600") },
  { color: "purple", gradients: clsx("from-purple-600 to-violet-600") },
  { color: "pink", gradients: clsx("from-pink-600 to-rose-600") },
];

const createListSchema = z.object({
  name: z.string().min(1),
  token: z.string().optional(),
  color: z.enum(["blue", "green", "orange", "purple", "pink"]).default("blue"),
});

const editListSchema = z.object({
  name: z.string().min(1).optional(),
  token: z.string().optional(),
  color: z.enum(["blue", "green", "orange", "purple", "pink"]).optional(),
});

const Props = z.object({
  formType: z.enum(["add", "edit"]),
  currList: z.number().optional(),
});

export default function ListForm({
  formType,
  currList,
}: z.infer<typeof Props>) {
  const router = useRouter();
  const context = api.useUtils();

  const { data: listData } = api.list.getListContents.useQuery(
    Number(currList) || 0,
    { enabled: !!currList && formType === "edit" }
  );

  const { mutate: addList, data: newListData } =
    api.list.addNewList.useMutation({
      async onSuccess() {
        await context.invalidate();
      },
    });

  const { mutate: editList } = api.list.editList.useMutation({
    async onSuccess() {
      await context.invalidate();
    },
    onError: () => handleError(),
  });

  const [name, setName] = useState(listData?.name || "");
  const [selectedColor, setSelectedColor] = useState(listData?.color || "");
  const [disabled, setDisabled] = useState(true);
  const [buttonError, setButtonError] = useState(false);

  const { data: existingName } = api.list.isExisting.useQuery(String(name));

  useEffect(() => {
    if (newListData?.success) {
      router.push("/").catch(() => {
        console.error("Couldn't navigate");
      });
    }
  }, [newListData, router]);

  useEffect(() => {
    if (formType === "add") {
      const parsed = createListSchema.safeParse({
        name,
        color: selectedColor,
      });
      setDisabled(!parsed.success || !!existingName);
      return;
    }

    const parsed = editListSchema.safeParse({
      name,
      color: selectedColor,
    });

    setDisabled(
      parsed.success === false ||
        (name === listData?.name && selectedColor === listData?.color)
    );
  }, [
    formType,
    name,
    selectedColor,
    listData?.name,
    listData?.color,
    existingName,
  ]);

  const handleSubmit = () => {
    if (formType === "add") {
      const parsed = createListSchema.safeParse({
        name,
        color: selectedColor,
      });
      if (parsed.success) {
        addList(parsed.data);
      }
    }

    if (formType === "edit") {
      const parsed = editListSchema.safeParse({
        name,
        color: selectedColor,
      });
      if (parsed.success) {
        editList({
          id: currList!,
          newName: parsed.data.name,
          newColor: parsed.data.color,
        });
      }
    }
  };

  const handleError = () => {
    setButtonError(true);
    setTimeout(() => {
      setButtonError(false);
    }, 2500);
  };

  const buttonName = () => {
    if (buttonError) return "Invalid Plex Token";

    if (formType === "add") {
      return existingName ? "List name already exists" : "Create";
    }

    if (existingName && name !== listData?.name) {
      return "List name already exists";
    }

    return "Save";
  };

  return (
    <>
      <div className="flex flex-col justify-between gap-2">
        <label htmlFor="name">Name</label>
        <input
          required
          placeholder="My Cool List"
          type="text"
          id="name"
          className="rounded-xl border-2 border-slate-600 bg-slate-900 px-4 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span>Color</span>
        <div className="flex justify-between">
          {COLOR_LIST.map(({ gradients: className, color }, i) => (
            <div
              key={i}
              className={clsx(
                "h-8 w-8 rounded-full bg-gradient-to-br hover:cursor-pointer",
                className,
                color === selectedColor && "border-2 border-white"
              )}
              onClick={() => {
                setSelectedColor(color);
              }}
            />
          ))}
        </div>
      </div>

      <button
        className={clsx(
          "rounded-xl p-2 font-bold  disabled:bg-slate-700",
          buttonError ? "bg-red-600" : "bg-blue-500"
        )}
        disabled={disabled}
        onClick={handleSubmit}
      >
        {buttonName()}
      </button>
    </>
  );
}
