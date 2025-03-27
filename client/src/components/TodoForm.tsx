import { Button, Flex, Input, Spinner } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { IoMdAdd } from "react-icons/io";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const TodoForm = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [newTodo, setNewTodo] = useState("");

  const queryClient = useQueryClient();

  const { mutate: createTodo, isPending: isCreating } = useMutation({
    mutationKey: ["createTodo"],
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const res = await fetch(BASE_URL + `/todos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ body: newTodo }),
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        setNewTodo("");
        return data;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error("An unknown error occurred");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error) => {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred");
      }
    },
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form onSubmit={createTodo}>
      <Flex gap={2}>
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          ref={inputRef}
        />
        <Button
          mx={2}
          type="submit"
          _active={{
            transform: "scale(.97)",
          }}
        >
          {isCreating ? <Spinner size={"xs"} /> : <IoMdAdd size={30} />}
        </Button>
      </Flex>
    </form>
  );
};
export default TodoForm;
